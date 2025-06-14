import React from 'react'
import { getBrand, getCategory } from '../library/api-call';
import Image from 'next/image';
import Link from 'next/link';
import ProductDetails from '@/components/website/ProductDetails';


export default async function page() {

  const categoryJSON = await getCategory();
  const catdata = categoryJSON?.categorys;

  const brandJSON = await getBrand();
  const branddata = brandJSON?.brands;


  const topbrand = branddata.slice(0, 10)

  console.log(topbrand)
  const topcat = catdata.slice(1, 6)
  const topfour = catdata.slice(0, 4)



  return (
    <div className='max-w-[1360px] mx-auto '>
      <div className="py-4 flex flex-col md:flex-row gap-6">
        {/* Left: Category List */}
        <div className="bg-white w-full md:w-[30%] lg:w-[25%] shadow rounded-xl p-5">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Category</h2>
          <ul className="flex flex-col gap-5">
            {topcat.map((cat, index) => (
              <Link key={index} href={`/store/${cat?.slug}`}>
                <li
                  className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/category/${cat.categoryImage}`}
                      alt={cat.name}
                      width={30}
                      height={30}
                      className="rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{cat.name}</span>
                  </div>
                  <span className="text-xs text-white bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Right: Banner with Slight Zoom Appearance */}
        <div className="relative w-full md:w-[70%] lg:w-[75%] rounded-3xl overflow-hidden shadow-lg min-h-[300px] md:min-h-[400px]">
          <div className="absolute inset-0 scale-110">
            <Image
              src="/hometopbanner.png"
              alt="Newsletter"
              fill
              className="object-cover bg-center"
              priority
            />
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-opacity-30 flex flex-col justify-center items-start p-6 sm:p-10 text-white space-y-4 z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-xl">
              Don’t miss amazing grocery deals
            </h1>
            <p className="text-sm sm:text-base md:text-lg">Sign up for the daily newsletter</p>
            <form className="flex w-full flex-wrap  max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="p-4  rounded-4xl  border-white border-1  outline-none text-white"
              />
              <button type="submit" className="bg-teal-500 ms-3 mt-3 sm:mt-0 p-3 text-white px-5 rounded-4xl  font-semibold">Subscribe</button>
            </form>
          </div>
        </div>
      </div>


      {/* second sec */}


      <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Brands */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">FEATURED BRANDS</h2>
            <Link href="/store" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {topbrand.map((brand, index) => (
              <div key={index} className="flex cursor-pointer items-center justify-center p-2 hover:scale-105 transition-transform">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/brand/${brand.brandImage}`}
                  alt={brand.name}
                  width={70}
                  height={40}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">TOP CATEGORIES</h2>
            <Link href="/store" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topfour.map((cat, index) => (
              <Link
                key={index}
                href={`/store/${cat.slug}`}
                className="flex flex-col items-center text-center hover:text-blue-600 transition-colors"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/category/${cat.categoryImage}`}
                  alt={cat.name}
                  width={60}
                  height={60}
                  className="object-contain mb-2"
                />
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>



      {/* third sec */}

    

      <ProductDetails />

    </div>
  )
}
