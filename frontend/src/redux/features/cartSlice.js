import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        final_total: 0,
        original_total: 0
    },
    reducers: {
        Additem: (state, action) => {
            const { final_price, original_price, productId } = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.qty += 1;
            } else {
                state.items.push({ productId, qty: 1, original_price, final_price });
            }

            state.final_total += final_price;
            state.original_total += original_price;

            localStorage.setItem("cart", JSON.stringify(state));
        },

        qtyhandler: (state, action) => {
            const { productId, flag } = action.payload;
            const item = state.items.find(i => i.productId === productId);

            if (item) {
                if (flag === "inc") {
                    item.qty += 1;
                } else if (flag === "dec" && item.qty > 1) {
                    item.qty -= 1;
                }
            }

            // Recalculate totals
            let originalTotal = 0;
            let finalTotal = 0;

            state.items.forEach(i => {
                originalTotal += i.original_price * i.qty;
                finalTotal += i.final_price * i.qty;
            });

            state.original_total = originalTotal;
            state.final_total = finalTotal;

            localStorage.setItem("cart", JSON.stringify(state));
        },

        removetoCart: (state, action) => {
            const { productId } = action.payload;

            const itemIndex = state.items.findIndex(item => item.productId === productId);
            if (itemIndex !== -1) {
                const item = state.items[itemIndex];

                // Subtract that item's total from totals
                state.final_total -= item.final_price * item.qty;
                state.original_total -= item.original_price * item.qty;

                // Remove the item
                state.items.splice(itemIndex, 1);
            }

            localStorage.setItem("cart", JSON.stringify(state));
        },





    emptyCart: (state) => {
        state.items = [];
        state.final_total = 0
        state.original_total = 0;
        localStorage.removeItem("cart");

    },

    lstocart: (state) => {
        const lsCart = JSON.parse(localStorage.getItem("cart"));
        if (lsCart) {
            state.items = lsCart.items;
            state.final_total = lsCart.final_total;
            state.original_total = lsCart.original_total;
        }
    }
}
});

// Export actions
export const { Additem, emptyCart, removetoCart, qtyhandler, lstocart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
