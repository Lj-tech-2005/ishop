const express = require("express");
const userRouters = express.Router();
const userController = require("../controllers/userController")



userRouters.post("/register", userController.register);
userRouters.post("/login", userController.login);



module.exports = userRouters;