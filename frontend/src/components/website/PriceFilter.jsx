'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function PriceFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams);

        params.set('minPrice', String(minPrice));
        params.set('maxPrice', String(maxPrice));

        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const min = parseInt(searchParams.get('minPrice') || '0');
        const max = parseInt(searchParams.get('maxPrice') || '1000');

        setMinPrice(min);
        setMaxPrice(max);
    }, [searchParams]);

    const adjustMin = (delta) => {
        setMinPrice((prev) => Math.max(0, Math.min(prev + delta, maxPrice)));
    };

    const adjustMax = (delta) => {
        setMaxPrice((prev) => Math.min(1000, Math.max(prev + delta, minPrice)));
    };

    return (
        <div className="mt-9 rounded-3xl  mx-auto">
            <h2 className="text-xl font-bold text-gray-900 text-center">Filter by Price</h2>

            <div className="flex flex-col gap-6">
                {/* Min Price */}
                <div className="space-y-2">
                    <label className="text-gray-700 font-medium block text-center sm:text-left">
                        Min Price: ${minPrice}
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                            onClick={() => adjustMin(-10)}
                            className="px-3 py-1 bg-gray-200 cursor-pointer rounded hover:bg-gray-300 transition"
                            aria-label="Decrease min price"
                        >
                            −
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="w-full sm:flex-1 accent-emerald-500 cursor-pointer"
                        />

                        <button
                            onClick={() => adjustMin(10)}
                            className="px-3 py-1 bg-gray-200 cursor-pointer rounded hover:bg-gray-300 transition"
                            aria-label="Increase min price"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Max Price */}
                <div className="space-y-2">
                    <label className="text-gray-700 font-medium block text-center sm:text-left">
                        Max Price: ${maxPrice}
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                            onClick={() => adjustMax(-10)}
                            className="px-3 py-1 bg-gray-200 cursor-pointer  rounded hover:bg-gray-300 transition"
                            aria-label="Decrease max price"
                        >
                            −
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full  sm:flex-1 accent-emerald-500 cursor-pointer"
                        />

                        <button
                            onClick={() => adjustMax(10)}
                            className="px-3 py-1 bg-gray-200 rounded cursor-pointer  hover:bg-gray-300 transition"
                            aria-label="Increase max price"
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    onClick={applyPriceFilter}
                    className="bg-gradient-to-r cursor-pointer  from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-lg shadow-md hover:scale-105 transition-transform"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
}
