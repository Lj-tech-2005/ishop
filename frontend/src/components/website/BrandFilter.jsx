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

            <Link href={"/store"}>
                <button className={`w-full text-white text-left cursor-pointer bg-[#01A49E] px-4 py-2 rounded-lg shadow text-sm font-medium mb-6 transition `} >
                    All Brands
                </button>
            </Link>

            <ul className="space-y-2 text-gray-700">
                {branddata?.map((brand, idx) => (
                    <li  key={idx}>
                        <button
                            onClick={() => setuserbrand(brand.slug)}
                            className={`w-full cursor-pointer flex justify-between items-center px-3 py-2 rounded-lg transition 
                            
                                
                                    hover:bg-blue-50 hover:text-blue-600
                                `}
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
