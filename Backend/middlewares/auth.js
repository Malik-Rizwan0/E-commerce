const ExpressError = require("../utils/ExpressError.js");
const warpAsync = require("../utils/warpAsync.js");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

module.exports.isAuthenticatedUser = warpAsync(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        throw new ExpressError(401, 'Please login to access this resource');
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();
});

module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ExpressError(403, `Role: ${req.user.role} is not allowed to access this resource`);
        }
        next();
    };
}