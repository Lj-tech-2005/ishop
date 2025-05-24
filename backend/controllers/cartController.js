const CartModel = require("../models/cartModel");

const cartController = {
    async moveToDb(req, res) {
        try {
            const { user_id, cart } = req.body;

            if (!user_id || !Array.isArray(cart)) {
                return res.status(400).json({ msg: 'Invalid data', flag: 0 });
            }

            // Process all cart items
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

            await Promise.all(allPromises); // Wait for all DB operations to complete

            // Fetch updated cart with populated product details
            const updatedCart = await CartModel.find({ user_id }).populate('product_id', '_id finalPrice originalPrice');

            res.status(200).json({ msg: 'Cart saved successfully', flag: 1, cart: updatedCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error', flag: 0 });
        }
    },

}

module.exports = cartController;