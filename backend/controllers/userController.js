
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
             return  res.send({ msg: "try with diffrent email id", flag: 0 })
            }


            const encPassword = cryptr.encrypt(password);
            const user = await new userModel({ name, email, password: encPassword });
            var token = jwt.sign({ ...user.toJSON() }, process.env.SECRET_KEY, { expiresIn: "24h" });
            user.save().then(

                () => {
                 return res.send({ msg: "Accound created ", flag: 1, token, user: { ...user.toJSON(), password: "" } })
                }

            ).catch(
                (err) => {

                    console.log(err)
                    res.send({ msg: "Unable to register ", flag: 0 })
                }

            )

        } catch (error) {
          return  res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) { 
                return res.status(400).send({ msg: "Email and password are required", flag: 0 }); 
            }
            const user = await userModel.findOne({ email: email });
            if (!user) {
                return res.send({ msg: "User not exist", flag: 0 })
            }

            if (password === cryptr.decrypt(user.password)) {
                var token = jwt.sign({ ...user.toJSON() }, process.env.SECRET_KEY, { expiresIn: "24h" });

                return res.send({ msg: "Login succesfully", user: { ...user.toJSON(), password: "" }, token, flag: 1 })
            } else {
                return res.send({ msg: "Incorrect password", flag: 0 })

            }

        } catch (error) {
            console.log(error)
            return res.send({ msg: "Internal Server Error", flag: 0 })
        }
    }
}


module.exports = userController;