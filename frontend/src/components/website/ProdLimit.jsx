'use client'


import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function ProdLimit() {

    const router = useRouter();
    const [limit, setlimit] = useState(0)

    useEffect(
        () => {
            const query = new URLSearchParams();
            query.append("limit", limit);
            router.push(`?limit=${limit}`)
        },[limit]
    )


    return (
        <div>
            <select onChange={(e) => setlimit(e.target.value)} className='p-2 ms-7 w-30 border rounded  cursor-pointer' name="" id="">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="10">6</option>
            </select>

        </div>
    )
}
