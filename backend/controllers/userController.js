
var jwt = require('jsonwebtoken');
const userModel = require("../models/userModels");
const fs = require('fs');
const Cryptr = require('cryptr');
const { genrateUniqueName } = require('../helper');
const cryptr = new Cryptr(process.env.SECRET_KEY);


const userController = {

    async register(req, res) {
        try {

            const { name, email, password } = req.body
            const existingUser = await userModel.findOne({ email: email });
            if (existingUser) {
                return res.send({ msg: "try with diffrent email id", flag: 0 })
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
            return res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
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
    },
    // /controllers/userController.js
    updateProfile: async (req, res) => {
        try {

            const { userId, firstName, lastName, email, phone } = req.body;

            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                {
                    name: `${firstName} ${lastName}`,
                    firstName: firstName,
                    lastName: lastName,
                    email,
                    phone
                },
                { new: true }
            );
            ;

            res.send({ msg: 'Profile updated successfully', flag: 1, user: updatedUser });
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: 'Failed to update profile', flag: 0 });
        }
    },
    updateAddress: async (req, res) => {
        try {
            const { userId, index, addressLine1, addressLine2, city, state, postalCode, country, contact } = req.body;

            if (index === undefined || !userId) {
                return res.status(400).send({ msg: "Missing userId or index", flag: 0 });
            }

            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).send({ msg: "User not found", flag: 0 });
            }

            if (!Array.isArray(user.shipping_address)) {
                user.shipping_address = [];
            }

            const newAddress = { addressLine1, addressLine2, city, state, postalCode, country, contact };

            if (index < user.shipping_address.length) {
                user.shipping_address[index] = newAddress;
            } else if (user.shipping_address.length < 3) {
                user.shipping_address.push(newAddress);
            } else {
                return res.send({ msg: "Maximum 3 addresses allowed", flag: 0 });
            }

            await user.save();

            res.send({ msg: "Address updated successfully", flag: 1, user });
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: "Failed to update address", flag: 0 });
        }
    },
    async uploadProfileImage(req, res) {
        try {
            const { userId } = req.body;

            if (!userId || !req.files || !req.files.profileImage) {
                return res.send({ msg: "Please fill all required fields", flag: 0 });
            }

            const profileImage = req.files.profileImage;
            const fileName = genrateUniqueName(profileImage.name);
            const imagePath = `public/images/profile/${fileName}`;

            // Save the new image
            profileImage.mv(imagePath, async (err) => {
                if (err) {
                    console.log(err);
                    return res.send({ msg: "Image upload failed", flag: 0 });
                }

                const user = await userModel.findById(userId);
                if (!user) {
                    return res.send({ msg: "User not found", flag: 0 });
                }

                // Delete old image if exists
                if (user.profileImage) {
                    const oldImage = `public/images/profile/${user.profileImage}`;
                    if (fs.existsSync(oldImage)) {
                        fs.unlinkSync(oldImage);
                    }
                }

                // Update DB with new image
                const updatedUser = await userModel.findByIdAndUpdate(
                    userId,
                    { profileImage: fileName },
                    { new: true }
                );

                return res.send({
                    msg: "Profile photo updated successfully",
                    flag: 1,
                    user: updatedUser,
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', flag: 0 });
        }
    },

    async changePassword(req, res) {
        try {
            const { userId, currentPassword, newPassword } = req.body;

            if (!userId || !currentPassword || !newPassword) {
                return res.status(400).send({ msg: "Missing fields", flag: 0 });
            }

            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).send({ msg: "User not found", flag: 0 });
            }

            const decryptedPassword = cryptr.decrypt(user.password);
            if (decryptedPassword !== currentPassword) {
                return res.status(401).send({ msg: "Incorrect current password", flag: 0 });
            }

            user.password = cryptr.encrypt(newPassword);
            await user.save();

            return res.send({ msg: "Password changed successfully", flag: 1 });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: "Internal Server Error", flag: 0 });
        }
    }



}


module.exports = userController;