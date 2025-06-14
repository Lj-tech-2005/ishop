'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getproduct } from '@/app/library/api-call';
import AddToCart from './AddToCart';

export default function TopProductSection() {
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [defaultImage, setDefaultImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getproduct();
            const prod = response?.products?.[0];
            if (prod) {
                setProduct(prod);
                const defaultImg = prod?.thumbnail || prod?.images?.[0];
                setMainImage(defaultImg);
                setDefaultImage(defaultImg);
            }
        };
        fetchData();
    }, []);

    if (!product) return <div className="p-6 text-center">Loading...</div>;

    return (
        <section className="bg-white rounded-xl shadow">
            <h2 className="text-xl md:text-2xl font-bold text-white bg-teal-700 rounded-t-lg px-4 py-2 mb-4">
                DEALS OF THE DAY
            </h2>

            <div className="grid p-4 grid-cols-1 lg:grid-cols-3 gap-15 items-start">
                {/* Left: Main Image & Thumbnails */}
                <div className="flex  flex-col items-center gap-10 mt-2">
                    <div className="relative w-full h-[300px] rounded-lg  overflow-hidden">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${mainImage}`}
                            alt="Main Product"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div
                        className="flex gap-2 justify-center flex-wrap pt-2"
                        onMouseLeave={() => setMainImage(defaultImage)}
                    >
                        {product?.images?.slice(0, 4).map((img, idx) => (
                            <div
                                key={idx}
                                className="border rounded overflow-hidden cursor-pointer"
                                onMouseEnter={() => setMainImage(img)}
                            >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${img}`}
                                    alt={`Thumbnail ${idx + 1}`}
                                    width={48}
                                    height={56}
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    <AddToCart product={product} />
                </div>

                {/* Middle: Product Info */}
                <div className="space-y-5">
                    <div className="space-y-7">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{product?.name}</h3>
                        <p className="text-sm text-gray-600">{product?.shortDescription}</p>

                        <div className="text-md md:text-lg font-medium space-y-1">
                            <p>
                                MRP: <del className="text-gray-400">₹{product?.originalPrice}</del>
                            </p>
                            <p className="text-green-600 font-bold">Final Price: ₹{product?.finalPrice}</p>
                            <p className="text-sm text-red-500">
                                You save ₹{product?.originalPrice - product?.finalPrice}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {product?.topSelling && (
                                <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                                    Top Selling
                                </span>
                            )}
                            {product?.stock ? (
                                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                    In Stock
                                </span>
                            ) : (
                                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                                    Out of Stock
                                </span>
                            )}
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                FREE SHIPPING
                            </span>
                            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                                FREE GIFT
                            </span>
                        </div>
                    </div>

                    {/* Countdown Timer (Static UI) */}
                    <div className="pt-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-700">
                            HURRY UP! PROMOTION WILL EXPIRES IN
                        </p>
                        <div className="flex gap-2 text-white font-bold text-sm text-center">
                            <div className="bg-gray-800 px-3 py-2 rounded">162d</div>
                            <div className="bg-gray-800 px-3 py-2 rounded">09h</div>
                            <div className="bg-gray-800 px-3 py-2 rounded">02m</div>
                            <div className="bg-gray-800 px-3 py-2 rounded">34s</div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: '35%' }}></div>
                        </div>
                        <p className="text-sm text-gray-500">
                            Sold: <strong>26/75</strong>
                        </p>
                    </div>
                </div>

                {/* Right: Promo Banners */}
                <div className="flex flex-col gap-4 items-center">
                    <div className="relative w-[296px] h-[177px] rounded-xl  overflow-hidden">
                        <Image src="/homeprodetils1.png" alt="Promo 1" width={296} height={177} className="object-cover" />
                    </div>
                    <div className="relative w-[296px] h-[177px] rounded-xl  overflow-hidden">
                        <Image src="/homeprodetils2.png" alt="Promo 2" width={296} height={177} className="object-cover" />
                    </div>
                    <div className="relative w-[296px] h-[177px] rounded-xl  overflow-hidden">
                        <Image src="/homeprodetils3.png" alt="Promo 3" width={296} height={177} className="object-cover" />
                    </div>
                </div>
            </div>
            <Image
                src="/productdetailsbn.png"
                alt="bn"
                width={1200}
                height={400}
                className="w-full"
            />
        </section>
    );
}
