import { getCategory } from '@/app/library/api-call';
import React from 'react'
import Link from 'next/link';
import ColorFilter from '@/components/website/ColorFilter';
import ProdLimit from '@/components/website/ProdLimit';
import PriceFilter from '@/components/website/PriceFilter';
import Image from 'next/image';
import BrandFilter from '@/components/website/BrandFilter';


export default async function layout({ children }) {
    const categoryJSON = await getCategory();
    const catdata = categoryJSON?.categorys;



    return (
        <section className='bg-[#E2E4EB]'>
            <div className="max-w-[1360px] mx-auto mt-6">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 p-6 w-full rounded-2xl bg-white mb-4">
                    <span>Home</span> /
                    {/* <span>Store</span> /{" "} */}
                    <span className="font-semibold text-black">Store</span>
                </div>

                {/* Section Title */}
                <div className="bg-white p-4 mb-6 rounded-2xl">
                    <h2 className="text-lg font-bold text-black mb-4">
                        TOP CELL PHONES & TABLETS
                    </h2>

                    {/* Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Headphone Card */}
                        <div
                            className="rounded-lg shadow-md bg-center bg-cover h-[280px] md:h-[310px] col-span-1 md:col-span-2 relative text-white flex items-start justify-start p-6"
                            style={{ backgroundImage: "url('/storetop1.png')" }}
                        >
                            <div className=" p-4 rounded-lg max-w-[80%]">
                                <h3 className="text-3xl font-bold mb-1">Noise Cancelling</h3>
                                <p className="text-lg mb-2">Headphone</p>
                                <p className="text-md-xl mb-4">
                                    Bose Over-Ear Headphone <br />
                                    Wifi, Voice Assistant, <br />
                                    Low Latency Game Mode
                                </p>

                            </div>
                        </div>

                        {/* Redmi Card */}
                        <div
                            className="rounded-lg shadow-md h-[280px] md:h-[310px] bg-center bg-cover w-full relative text-black flex items-start justify-start p-6"
                            style={{ backgroundImage: "url('/storetop2.png')" }}
                        >
                            <div className="bg-white/70 p-4 rounded-lg max-w-[80%]">
                                <h3 className="text-xl font-semibold mb-1">redmi note 12 Pro+ 5g</h3>
                                <p className="text-sm mb-4">Rise to the challenge</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <main className="max-w-7xl mx-auto pb-8">
                <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-6">POPULAR CATEGORIES</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-8">
                        {catdata?.map((cat) => (
                            <div key={cat._id} className="flex flex-col items-center text-center space-y-2">
                                <Link href={`/store/${cat?.slug}`}>
                                    <div className="w-16 h-16 relative">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/category/${cat.categoryImage}`}
                                            alt={cat.name}

                                            className="object-contain"
                                        />

                                    </div>

                                </Link>
                                <h3 className="text-sm font-semibold">{cat.name}</h3>
                                <p className="text-xs text-gray-500">{cat.productCount} Items</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>


            <div className='w-full p-4 bg-white'>
                <div className='md:grid grid-cols-5'>
                    <div className="bg-[#EEEFF6] p-4 rounded-2xl w-full shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-wide">CATEGORIES</h2>

                        <Link href="/store">
                            <button className="bg-[#01A49E] cursor-pointer hover:bg-[#4d7d7b] text-white text-sm font-medium px-4 py-2 rounded-lg shadow w-full transition duration-200 mb-6">
                                All Categories
                            </button>
                        </Link>

                        <div>
                            {/* <h3 className="text-md font-semibold text-gray-700 mb-3">Cell Phones & Tablets</h3> */}
                            <ul className="space-y-2 text-sm text-gray-700">
                                {catdata?.map((category, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={`/store/${category?.slug}`}
                                            className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                                        >
                                            <span>{category.name}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{category?.productCount}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <ColorFilter />
                        <PriceFilter />

                        <BrandFilter />
                    </div>
                    <div className='col-span-4'>
                        <ProdLimit />
                        {children}
                    </div>

                </div>
            </div>
        </section>
    )
}
