const ExpressError = require("../utils/ExpressError.js")
const warpAsync = require("../utils/warpAsync.js")
const User = require("../models/userModel.js")
const { sendToken } = require("../utils/jwtToken.js")
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto")
const cloudinary = require("../utils/cloudinary.js");

exports.registerUser = warpAsync(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;


        if (!name || !email || !password) {
            throw new ExpressError(400, 'Please provide all required fields');
        }

        let avatarData = {
            public_id: "default_avatar",
            url: "/images/default_avatar.png",
        };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
                width: 150,
                height: 150,
                crop: "fill",
            });

            avatarData = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarData,
        });

        sendToken(res, user, 201);
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});


exports.loginUser = warpAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ExpressError(400, 'Please provide email and password');
    }
    const user = await User.findOne({ email }).select("+password"); // as we select password false in userSchema so we can access it simply
    //so we use .select("+password") method to access it
    if (!user) {
        throw new ExpressError(401, 'Invalid email or password');
    }
    const isPasswordMatched = await user.comparePassword(password); // comparePassword is a method we created in userModel.js to compare the password
    if (!isPasswordMatched) {
        throw new ExpressError(401, 'Invalid email or password');
    }

    sendToken(res, user, 200);
    // const token = user.getJWTToken();
    // res.status(200).json({
    //     success: true,
    //     user,
    //     token
    // });
})

exports.logout = warpAsync(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
})

// forget password
exports.forgotPassword = warpAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new ExpressError(400, 'Please provide your email');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ExpressError(404, 'User not found with this email');
    }
    // Generate reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`;
    try {
        await sendEmail({
            email: user.email,
            subject: "E-commerce Password Recovery",
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ExpressError(500, 'Email could not be sent');
    }
})

// reset password
exports.resetPassword = warpAsync(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    ;

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        throw new ExpressError(400, 'Reset password token is invalid or has expired');
    }
    if (req.body.password !== req.body.confirmPassword) {
        throw new ExpressError(400, 'Passwords do not match');
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(res, user, 200);
})

exports.getUserDetails = warpAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ExpressError(404, 'User not found');
    }
    res.status(200).json({
        success: true,
        user
    });
})

exports.updatePassword = warpAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
        throw new ExpressError(404, 'User not found');
    }
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        throw new ExpressError(401, 'Old password is incorrect');
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        throw new ExpressError(400, 'Passwords do not match');
    }
    user.password = req.body.newPassword;
    await user.save();

    sendToken(res, user, 200);
})

// get all users by admin
exports.getAllUsers = warpAsync(async (req, res, next) => {
    const users = await User.find();
    if (!users) {
        throw new ExpressError(404, 'No users found');
    }
    res.status(200).json({
        success: true,
        users
    });
})
// Get single user by admin
exports.getSingleUser = warpAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ExpressError(404, `User not found with ID: ${req.params.id}`);
    }
    res.status(200).json({
        success: true,
        user
    });
})
// Update user role by admin
exports.updateUserRole = warpAsync(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role // Assuming role is provided in the request body
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!user) {
        throw new ExpressError(404, `User not found with ID: ${req.params.id}`);
    }

    res.status(200).json({
        success: true,
        user
    });
})

exports.updateProfile = warpAsync(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    // If a new avatar was uploaded
    if (req.file) {
        const user = await User.findById(req.user.id);

        // Destroy the old avatar
        const imageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(imageId);

        // req.file already contains Cloudinary upload info
        newUserData.avatar = {
            public_id: req.file.filename, // public_id
            url: req.file.path,           // secure_url
        };
    }

    // Update user in DB
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// Delete user by admin
exports.deleteUser = warpAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ExpressError(404, `User not found with ID: ${req.params.id}`);
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
})

// Note: The above code assumes that the User model has methods like getJWTToken and comparePassword defined.
// The sendToken function is used to send the JWT token in the response.