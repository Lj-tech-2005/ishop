'use client'
import { Additem } from '@/redux/features/cartSlice';
import { original } from '@reduxjs/toolkit';
import React from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

export default function AddToCart({ product }) {
    const dispatcher = useDispatch()
    function addcart() {
        dispatcher(Additem({
            productId: product._id,
            original_price: product.originalPrice,
            final_price: product.finalPrice,

        }))

    }



    return (
        <button onClick={addcart} className="mt-2 w-full flex cursor-pointer items-center justify-center gap-2 bg-[#01A49E] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition duration-300">
            <FaShoppingCart />
            Add to Cart
        </button>
    )
}
