const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// build in node module to generate random tokens
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "Email already exists"],
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password should be greater than 8 characters"],
        select: false,
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                });
            },
            message: "Password must be strong (include uppercase, lowercase, number, and symbol)"
        }
    },
    avatar: {
        public_id: {
            type: String,
            default: "https://res.cloudinary.com/dnyfyjwv4/image/upload/v1753524667/Profile_hlpyz2.png",
            required: true
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/dnyfyjwv4/image/upload/v1753524667/Profile_hlpyz2.png",
            required: true
        }
    },
    role : {
        type: String,
        default: "user"
    },
     createdAt: {
    type: Date,
    default: Date.now,
  },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// to hash the password before saving the user document
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// JWT TOKEN GENERATION
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate a token using crypto
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash the token and set it to resetpasswordToken field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set the expiration time for the token
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken; // Return the plain token for sending to user
}

module.exports = mongoose.model("User", userSchema)