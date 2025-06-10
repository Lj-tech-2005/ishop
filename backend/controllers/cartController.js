const CartModel = require("../models/cartModel");

const cartController = {
    async moveToDb(req, res) {
        try {
            const { user_id, cart } = req.body;
            // Only update if cart is a valid array with items
            if (Array.isArray(cart) && cart.length > 0) {
                const allPromises = cart.map(async (item) => {
                    const { productId, qty } = item;
                    const existingCart = await CartModel.findOne({ user_id, product_id: productId });

                    if (existingCart) {
                        existingCart.qty += Number(qty);
                        await existingCart.save();
                    } else {
                        await CartModel.create({ user_id, product_id: productId, qty: Number(qty) });
                    }
                });

                await Promise.all(allPromises); // Wait for DB operations
            }

            // Always return the latest cart from DB
            const updatedCart = await CartModel.find({ user_id }).populate(
                'product_id',
                '_id finalPrice originalPrice'
            );

            res.status(200).json({ msg: 'Cart processed successfully', flag: 1, cart: updatedCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error', flag: 0 });
        }
    },
    async addToCart(req, res) {
        try {

            const { userId, productId, qty } = req.body;

            if (!userId || !productId || !qty) {
                return res.status(400).json({ msg: "Missing required fields", flag: 0 });
            }

            const existingItem = await CartModel.findOne({ user_id: userId, product_id: productId });

            if (existingItem) {
                // Increase quantity atomically
                await CartModel.updateOne(
                    { _id: existingItem._id },
                    { $inc: { qty: Number(qty) } }
                );
            } else {
                // Create new cart item and await saving
                const newItem = new CartModel({
                    user_id: userId,
                    product_id: productId,
                    qty: Number(qty)
                });
                await newItem.save();
            }

            console.log("Hello")

            return res.status(200).json({ msg: "Cart updated successfully", flag: 1 });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Internal server error", flag: 0 });
        }
    },

    async updateqty(req, res) {
        try {
            const { userId, productId, qtychange } = req.body;

            if (!userId || !productId || qtychange === undefined || qtychange === null) {
                return res.status(400).send({ msg: "Missing required fields", flag: 0 });
            }

            const existingItem = await CartModel.findOne({ user_id: userId, product_id: productId });

            if (!existingItem) {
                return res.status(404).json({ msg: "Cart item not found", status: 0 });
            }

            let newqty = existingItem.qty + qtychange;
            if (newqty <= 0) {
                newqty = 1;
            }

            existingItem.qty = newqty;
            await existingItem.save();

            return res.status(200).json({ msg: "Quantity updated", status: 1 });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Internal server error", status: 0 });
        }
    },
    async removeFromCart(req, res) {
        try {
            const { userId, productId } = req.body;

            // Validate input
            if (!userId || !productId) {
                return res.status(400).json({ msg: "User ID and Product ID are required", flag: 0 });
            }

            // Delete the cart item
            const deletedItem = await CartModel.findOneAndDelete({
                user_id: userId,
                product_id: productId,
            });

            if (!deletedItem) {
                return res.status(404).json({ msg: "Cart item not found", flag: 0 });
            }

            // Fetch and populate updated cart
            const updatedCart = await CartModel.find({ user_id: userId }).populate(
                'product_id',
                '_id finalPrice originalPrice discountPercentage thumbnail stock name'
            );

            return res.status(200).json({
                msg: "Item removed from cart",
                flag: 1,
                cart: updatedCart,
            });
        } catch (error) {
            console.error("Cart removal error:", error);
            return res.status(500).json({ msg: "Internal Server Error", flag: 0 });
        }
    }






}
module.exports = cartController;