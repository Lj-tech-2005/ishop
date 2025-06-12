const express = require("express");
const userRouters = express.Router();
const userController = require("../controllers/userController")
const fileuploader = require("express-fileupload");


userRouters.post("/register", userController.register);
userRouters.post("/login", userController.login);
userRouters.put('/update-profile', userController.updateProfile);
userRouters.put('/update-address', userController.updateAddress);
userRouters.post('/change-password', userController.changePassword);
userRouters.put('/upload-profile-image',fileuploader({ createParentPath: true }), userController.uploadProfileImage);


module.exports = userRouters;