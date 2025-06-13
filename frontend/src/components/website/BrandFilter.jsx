'use client'

import { getBrand } from '@/app/library/api-call';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

export default function BrandFilter() {

    const [branddata, setbranddata] = useState([])
    const [userbrand, setuserbrand] = useState(null)
    const router = useRouter()
    async function getbrand() {

        const brandJSON = await getBrand();
        const allbrand = brandJSON?.brands;

        console.log(brandJSON, "chetan")
        setbranddata(allbrand)

    }

    useEffect(
        () => {
            const query = new URLSearchParams();
            query.append("brand", userbrand)
            router.push(`?${query}`)
        }, [userbrand]
    )
    useEffect(
        () => {
            getbrand()

        }, []
    )



    return (
        <div className="bg-[#EEEFF6] p-6 mt-15 rounded-2xl w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-wide">Brands</h2>

            <button
                onClick={() => setuserbrand(null)}
                className={`w-full text-left px-4 py-2 rounded-lg shadow text-sm font-medium mb-6 transition 
      ${userbrand === null ? 'bg-[#01A49E] text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            >
                All Brands
            </button>

            <ul className="space-y-2 text-gray-700">
                {branddata?.map((brand, idx) => (
                    <li key={idx}>
                        <button
                            onClick={() => setuserbrand(brand.slug)}
                            className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition 
            ${userbrand === brand.slug
                                    ? 'bg-blue-100 text-blue-700 font-semibold ring-2 ring-blue-400'
                                    : 'hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            <span>{brand.name}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{brand?.productCount}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>

    )
}
