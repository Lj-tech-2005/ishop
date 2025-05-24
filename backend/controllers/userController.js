
var jwt = require('jsonwebtoken');
const userModel = require("../models/userModels")
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_KEY);


const userController = {

    async register(req, res) {
        try {

            const { name, email, password } = req.body
            const existingUser = await userModel.findOne({ email: email });
            if (existingUser) {
                res.send({ msg: "try with diffrent email id", flag: 0 })
            }


            const encPassword = cryptr.encrypt(password);
            const user = await new userModel({ name, email, password: encPassword });
            var token = jwt.sign({ ...user.toJSON() }, process.env.SECRET_KEY, { expiresIn: "24h" });
            user.save().then(

                () => {
                    res.send({ msg: "Accound created ", flag: 1, token, user: { ...user.toJSON(), password: "" } })
                }

            ).catch(
                (err) => {

                    console.log(err)
                    res.send({ msg: "Unable to register ", flag: 0 })
                }

            )

        } catch (error) {
            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email: email });
            if (!user) {
                res.send({ msg: "User not exist", flag: 0 })
            }

            if (password === cryptr.decrypt(user.password)) {
                var token = jwt.sign({ ...user.toJSON() }, process.env.SECRET_KEY, { expiresIn: "24h" });

                res.send({ msg: "Login succesfully", user: { ...user.toJSON(), password: "" }, token, flag: 1 })
            } else {
                res.send({ msg: "Incorrect password", flag: 0 })

            }

        } catch (error) {
            console.log(error)
            res.send({ msg: "Internal Server Error", flag: 0 })
        }
    }
}


module.exports = userController;