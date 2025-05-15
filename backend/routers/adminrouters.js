const express = require("express");
const adminrouters = express.Router();
const adminController = require("../controllers/adminController")



adminrouters.post("/login", adminController.login);
adminrouters.get("/logout", (req, res) => {
    res.clearCookie("admin_token", {
        httpOnly: true,  // Prevents JavaScript access (recommended for security)
        secure: true,    // Send only over HTTPS
        sameSite: 'lax'  // Controls cross-site sending
    });

    res.status(200).json({ message: "Logged out successfully" });
});



module.exports = adminrouters;