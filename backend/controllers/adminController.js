const adminmodel = require("../models/adminmodels")
var jwt = require('jsonwebtoken');
const adminController = {

    async login(req, res) {

        const { email, password } = req.body

        try {
            const admin = await adminmodel.findOne({ email: email });
            if (!admin) {
                res.send({ msg: "admin is not exist", flag: 1 });

            }

            if (password === admin.password) {
                var token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
                res.cookie('admin_token', token, {
                    httpOnly: false,         // Prevents JavaScript access (recommended for security)
                    secure: true,           // Send only over HTTPS
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    samesite: 'lax',        // Helps prevent CSRF
                });
                res.send({ msg: "login successfully", flag: 1, admin: { ...admin.toJSON(), password: "", token } });

            } else {

                res.send({ msg: "incorrect password", flag: 0 });

            }

        } catch (error) {

            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });

        }

    }
}

module.exports = adminController;