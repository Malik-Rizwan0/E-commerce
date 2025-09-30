const express = require("express");
const router = express.Router();
const { registerUser, loginUser , logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userControler.js");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.js");
const upload = require("../middlewares/multer.js"); // <- import multer config



router.post("/register", upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);
router.route("/password/forget").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/password/update").put(isAuthenticatedUser, updatePassword); // This route is for authenticated users to reset their password
router.route("/logout").get(logout)
router.route("/profile" ).get(isAuthenticatedUser, getUserDetails)   
router.route("/profile/update").put(isAuthenticatedUser, upload.single("avatar") ,updateProfile); // This route is for authenticated users to update their profile
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin") , getAllUsers ); // This route is for authenticated users to update their profile
router.route("/admin/user/:id")
.get(isAuthenticatedUser, authorizeRoles("admin") , getSingleUser )
.put(isAuthenticatedUser, authorizeRoles("admin") , updateUserRole)
.delete(isAuthenticatedUser, authorizeRoles("admin") , deleteUser )
; // This route is for authenticated users to update their profile
module.exports = router;