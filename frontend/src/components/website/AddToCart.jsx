'use client'
import { axiosApiInstance } from '@/app/library/helper';
import { Additem } from '@/redux/features/cartSlice';
import React from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

export default function AddToCart({ product }) {
    const dispatcher = useDispatch()
    const user = useSelector((state) => state.user?.data);

   
     
    function addcart() {

        if (user != null) {

            axiosApiInstance.post("cart/add-to-cart",{
                userId:user?._id,
                productId:product._id,
                qty:1

            });


        }

        dispatcher(Additem({
            productId: product._id,
            original_price: product.originalPrice,
            final_price: product.finalPrice,

        }))

    }



    return (
        <button onClick={addcart} className="mt-2 w-full flex cursor-pointer items-center justify-center gap-2  bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300">
            <FaShoppingCart />
            Add to Cart
        </button>
    )
}
