const express = require("express");
const CartRouter = express.Router();
const CartController = require("../controllers/cartController")


CartRouter.post('/move-to-db', CartController.moveToDb);




module.exports = CartRouter;