'use client'

import { getColor } from '@/app/library/api-call';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function ColorFilter() {

    const [colordata, setcolordata] = useState([])
    const [usercolor, setusercolor] = useState(null)
    const router =useRouter()
        async function getcolors() {

            const colorJSON = await getColor();
            const allcolor = colorJSON?.colors;

            setcolordata(allcolor)

        }

    useEffect(
        () => {
            const query = new URLSearchParams();
            query.append("color", usercolor)
            router.push(`?${query}`)
        }, [usercolor]
    )
    useEffect(
        () => {
            getcolors()

        }, []
    )

    return (
        <div className="mt-10">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Colors</h3>
            <ul className="flex flex-wrap gap-3">
                {colordata?.map((color, idx) => (
                    <li key={idx}>

                        <div
                            title={color.name}
                            onClick={() => setusercolor(color.slug)}
                            className="h-7 w-7 rounded-full border border-gray-300 shadow-sm transition-all duration-200 transform hover:scale-110 hover:ring-2 hover:ring-blue-500 cursor-pointer"
                            style={{ backgroundColor: color.Hexcode }}
                        ></div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
