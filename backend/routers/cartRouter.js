const express = require("express");
const CartRouter = express.Router();
const CartController = require("../controllers/cartController")


CartRouter.post('/move-to-db', CartController.moveToDb);
CartRouter.post('/add-to-cart', CartController.addToCart);
CartRouter.post('/update-qty', CartController.updateqty);
CartRouter.post('/remove', CartController.removeFromCart);




module.exports = CartRouter;