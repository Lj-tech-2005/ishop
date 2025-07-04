import React from 'react'
import { getBrand, getCategory, getproduct } from '../library/api-call';
import Image from 'next/image';
import Link from 'next/link';
import ProductDetails from '@/components/website/ProductDetails';
import Responsive from '@/components/website/Responsive';
import Responsivetwo from '@/components/website/Responsivetwo';
import Responsivethree from '@/components/website/Responsivethree';
import AddToCart from '@/components/website/AddToCart';
import RecentlyViewedSection from '@/components/website/RecentlyViewedSection';


export default async function page() {

  const categoryJSON = await getCategory();
  const catdata = categoryJSON?.categorys;

  const brandJSON = await getBrand();
  const branddata = brandJSON?.brands;


  const topbrand = Array.isArray(branddata) ? branddata.slice(0, 10) : [];
  const topcat = Array.isArray(catdata) ? catdata.slice(8, 13) : [];
  const topfour = Array.isArray(catdata) ? catdata.slice(8, 12) : [];
  const smartphonecat = Array.isArray(catdata) ? catdata.slice(13, 19) : [];
  const laptopcat = Array.isArray(catdata) ? catdata.slice(19, 25) : [];
  const Audioscat = Array.isArray(catdata) ? catdata.slice(25, 29) : [];
  const gamingcat = Array.isArray(catdata) ? catdata.slice(29, 33) : [];
  const officecat = Array.isArray(catdata) ? catdata.slice(33, 37) : [];



  const response = await getproduct(undefined, undefined, undefined, undefined, 0, null, null, 1, true);

  const products = response?.products?.slice(0, 8) || [];


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
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${cat.categoryImage}`}
                      alt={cat.name}
                      width={30}
                      height={30}
                      className="rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{cat.name}</span>
                  </div>
                  <span className="text-xs text-white bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center">
                    {cat?.productCount}
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
            {topbrand?.map((brand, index) => (
              <Link key={index} href={"/store"}>
                <div key={index} className="flex cursor-pointer items-center justify-center p-2 hover:scale-105 transition-transform">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/brand/${brand.brandImage}`}
                    alt={brand.name}
                    width={70}
                    height={40}
                    className="object-contain"
                  />
                </div>

              </Link>
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
          <div className="grid grid-cols-2 mt-10 sm:grid-cols-4 gap-4">
            {topfour?.map((cat, index) => (
              <Link
                key={index}
                href={`/store/${cat.slug}`}
                className="flex flex-col items-center text-center hover:text-blue-600 transition-colors"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${cat.categoryImage}`}
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
      <Responsive />

      {/* fourth section */}

      <section className="bg-white p-3 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between px-4 gap-2">
          <h2 className="text-lg font-semibold mb-2">TOP CELLPHONES & TABLETS</h2>
          <Link href="/store" className="text-sm text-blue-600 hover:underline self-start sm:self-center">
            View All
          </Link>
        </div>

        <div className="py-4 border-b-2 border-[#99999944] grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Banner */}
          <div className="relative h-[200px] sm:h-[225px] rounded-xl overflow-hidden">
            <Image
              src="/prod18.png"
              alt="Redmi Note 12 Pro+ 5G"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-5 flex flex-col justify-center z-10 text-white">
              <h3 className="text-base sm:text-xl font-bold mb-1">REDMI NOTE 12 <br /> PRO+ 5G</h3>
              <p className="text-xs sm:text-sm text-white mb-3">Rise to the challenge</p>
              <button className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:opacity-80 text-sm w-fit">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Right: Top Categories */}
          <div className="bg-white h-auto lg:h-[225px] rounded-xl p-4 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full">
              {smartphonecat?.map((cat, index) => (
                <Link
                  key={index}
                  href={`/store/${cat.slug}`}
                  className="flex flex-col items-center text-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${cat.categoryImage}`}
                    alt={cat.name}
                    width={48}
                    height={48}
                    className="object-contain rounded"
                  />
                  <div className="truncate w-full">
                    <h3 className="text-sm font-semibold">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat?.productCount} Items</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Responsivetwo />
      </section>



      {/* Laptops section */}

      <section className="bg-white mt-15 p-3 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:justify-between px-4 gap-3">
          <h2 className="text-lg font-semibold mb-2">TOP CELLPHONES & TABLETS</h2>
          <div>
            <Link href="/store" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
        </div>

        <div className="py-4 border-b-2 border-[#99999944] grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Featured Product Banner */}
          <div className="relative h-[200px] sm:h-[225px] rounded-xl overflow-hidden">
            <Image
              src="/laptopbanner.png"
              alt="Redmi Note 12 Pro+ 5G"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute text-white inset-0 bg-gradient-to-r from-black/60 to-transparent p-5 flex flex-col justify-center z-10">
              <h3 className="text-base sm:text-xl font-bold mb-1">Apple MacBook <br /> Air M2 Chip</h3>
              <p className="text-xs sm:text-sm text-white mb-3">Rise to the challenge</p>
              <button className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:opacity-80 text-sm w-fit">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Right: Top Categories */}
          <div className="bg-white h-auto lg:h-[225px] rounded-xl p-4 flex flex-col justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {laptopcat?.map((cat, index) => (
                <Link
                  key={index}
                  href={`/store/${cat.slug}`}
                  className="flex flex-col items-center text-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${cat.categoryImage}`}
                    alt={cat.name}
                    width={48}
                    height={48}
                    className="object-contain rounded"
                  />
                  <div>
                    <h3 className="text-sm font-semibold truncate">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat?.productCount} Items</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Responsivethree />
      </section>


      <section className="flex flex-col mt-9 justify-center lg:flex-row gap-6 rounded-xl p-4">
        {/* Section 1 */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition w-full lg:w-[32%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-800 uppercase">AUDIOS & CAMERAS</h2>
            <a href="/store" className="text-sm text-blue-500 hover:underline cursor-pointer">View All</a>
          </div>

          <div className="mb-4 relative rounded-lg overflow-hidden">
            <Image
              src="/prod.png"
              alt="Best Speaker 2023"
              width={400}
              height={200}
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-white text-xs font-medium">
              <p>Best</p>
              <p>Speaker</p>
              <p>2023</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            {Audioscat?.map((cat, index) => (
              <Link key={index} href={`/store/${cat.slug}`} className="group">
                <div className="bg-white border border-gray-200 group-hover:border-blue-500 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-sm transition-all">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${cat.categoryImage}`}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <p className="mt-2 text-sm font-medium truncate group-hover:text-blue-600">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat?.productCount} Items</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition w-full lg:w-[32%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-800 uppercase">Gaming</h2>
            <a href="/store" className="text-sm text-blue-500 hover:underline cursor-pointer">View All</a>
          </div>

          <div className="mb-4 relative rounded-lg overflow-hidden">
            <Image
              src="/prod2.png"
              alt="Best Gaming Mouse"
              width={400}
              height={200}
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-white text-xs font-medium">
              <p>Wireless</p>
              <p>RGB Gaming</p>
              <p>Mouse</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            {gamingcat?.map((cat, index) => (
              <Link key={index} href={`/store/${cat.slug}`} className="group">
                <div className="bg-white border border-gray-200 group-hover:border-blue-500 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-sm transition-all">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${cat.categoryImage}`}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <p className="mt-2 text-sm font-medium truncate group-hover:text-blue-600">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat?.productCount} Items</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition w-full lg:w-[32%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-800 uppercase">Office Equipments</h2>
            <a href="/store" className="text-sm text-blue-500 hover:underline cursor-pointer">View All</a>
          </div>

          <div className="mb-4 relative rounded-lg overflow-hidden">
            <Image
              src="/prod3.png"
              alt="Office Products"
              width={400}
              height={200}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            {officecat?.map((cat, index) => (
              <Link key={index} href={`/store/${cat.slug}`} className="group">
                <div className="bg-white border border-gray-200 group-hover:border-blue-500 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-sm transition-all">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${cat.categoryImage}`}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <p className="mt-2 text-sm font-medium truncate group-hover:text-blue-600">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat?.productCount} Items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>




      <section className="max-w-[1360px] mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Deals for You</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-3 flex flex-col"
            >
              {/* Image with badges */}
              <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden bg-gray-100 rounded-lg flex items-center justify-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    -{product.discountPercentage}%
                  </span>
                )}
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  New Arrival
                </span>
              </div>

              {/* Product Name */}
              <Link href={`/singleproduct/${product._id}`}>
                <h3 className="mt-3 text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 cursor-pointer">
                  {product.name}
                </h3>
              </Link>

              {/* Prices */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-blue-700 font-semibold text-lg">
                  ₹{product.finalPrice}
                </span>
                {product.originalPrice > product.finalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <div className="mt-3">
                <AddToCart product={product} />
              </div>
            </div>
          ))}
        </div>
      </section>




      {/*   last section  */}

      <section className="mt-10 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left Card - Full Image Cover */}
          <div className="bg-teal-600 text-white rounded-2xl p-6 flex items-center justify-between min-h-[200px]">
            {/* Text Section */}
            <div className="space-y-2">
              <h3 className="text-sm md:text-base font-semibold uppercase">Massage Chair Luxury</h3>
              <p className="text-xs md:text-sm text-white/90">Fuka Relax Full Body<br />Massage Chair</p>
              <button className="mt-3 bg-white text-black text-sm font-medium px-5 py-2 rounded-full">
                Shop Now
              </button>
            </div>

            {/* Image Section */}
            <div className="relative w-28 h-28 md:w-36 md:h-36">
              <Image
                src="/chair.png"
                alt="Massage Chair"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Card - Full Image Cover */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden min-h-[220px]">
            <Image
              src="/bottomh2.png"
              alt="Phones"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>



      <RecentlyViewedSection />



      <section className="my-17 py-8 px-4 md:px-10">
        <div className="max-w-7xl mx-auto space-y-6 text-gray-700">

          {/* Heading */}
          <h2 className="text-lg md:text-xl font-semibold text-black">
            Shopindia – #1 Online Marketplace for Technology
          </h2>

          {/* First Paragraph */}
          <p className="text-sm md:text-base leading-relaxed">
            Shop india is your ultimate destination for the latest in technology. From smart gadgets and electronics to home appliances and wearables,
            we bring together top brands and unbeatable deals all in one place. Shop with confidence and convenience, with fast delivery
            and secure payment options.
          </p>

          {/* Second Paragraph */}
          <p className="text-sm md:text-base leading-relaxed">
            Whether you're upgrading your workspace, enhancing your home with smart tech, or searching for the perfect gift,
            Shop india has everything you need. Our curated collections make it easy to explore trending products, exclusive launches,
            and seasonal discounts tailored just for you. Discover innovation made accessible — only at Shopindia.
          </p>

        </div>
      </section>

    </div>
  )
}
