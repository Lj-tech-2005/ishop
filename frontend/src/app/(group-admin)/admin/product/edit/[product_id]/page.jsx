'use client';
import { use, useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { axiosApiInstance, createSlug, notify } from '@/app/library/helper';
import Select from 'react-select'
import { getBrand, getCategory, getColor, getproduct } from '@/app/library/api-call';
import RichTextEditor from '@/components/admin/RichTextEditor';
import Link from 'next/link';

export default function eiditProduct({ params }) {

  const param = use(params)
  const productid = param?.product_id



  const [category, setCategory] = useState();
  const [brand, setBrand] = useState();
  const [color, setColor] = useState();
  const [product, setproduct] = useState();
  const [selColors, setSelColors] = useState([])
  const [description, setdiscription] = useState("")
  const nameRef = useRef();
  const slugRef = useRef();
  const originalPriceRef = useRef();
  const discountPriceRef = useRef();
  const finalPriceRef = useRef();

  const fetchData = async () => {
    const categoryJSON = await getCategory();
    const catdata = categoryJSON?.categorys;
    setCategory(catdata)

    const colorJSON = await getColor();
    const colordata = colorJSON?.colors;
    setColor(colordata)

    const brandJSON = await getBrand();
    const branddata = brandJSON?.brands;
    setBrand(branddata)

    const response = await getproduct(productid);
    const products = response?.products;
    setproduct(products)

  }

  console.log(product)



  const changeHandler = () => {
    const slug = createSlug(nameRef.current.value);
    slugRef.current.value = slug;
  };

  const finalPrice = () => {
    const op = originalPriceRef.current.value;
    const dp = discountPriceRef.current.value;

    const final = Math.floor(op - op * (dp / 100));
    finalPriceRef.current.value = final;



  }


  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("slug", slugRef.current.value);
    formData.append("shortDescription", e.target.shortDesc.value);
    formData.append("longDescription", description);
    formData.append("originalPrice", originalPriceRef.current.value);
    formData.append("discountPercentage", discountPriceRef.current.value);
    formData.append("finalPrice", finalPriceRef.current.value);
    formData.append("categoryId", e.target.categoryId.value);
    formData.append("brandId", e.target.brandId.value);
    formData.append("colors", JSON.stringify(selColors))
    formData.append("thumbnail", e.target.productImage.files[0])

    axiosApiInstance.put(`product/update/${productid}`, formData).then(

      (res) => {

        notify(res.data.msg, res.data.flag)
        if (res.data.flag === 1) {

          e.target.reset()
          setdiscription("");
        }
      }

    ).catch((err) => {
      console.log("Update error:", err);

      if (err.response) {
        console.log("Backend error:", JSON.stringify(err.response.data, null, 2));
        notify(err.response.data.msg, 0); // यह यूज़र को error message दिखा देगा
      } else {
        console.log("Unexpected error:", JSON.stringify(err, null, 2));
        notify("कुछ गलत हो गया", 0); // fallback message
      }
    }

    )
  }
  useEffect(
    () => {
      fetchData()
    },
    []
  )
  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
        <div className='flex justify-between'>
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Edit Product</h2>
          <Link href={"/admin/product"}>
            <button className="flex  cursor-pointer items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950 px-4 py-2 rounded-full shadow hover:shadow-md transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </button>

          </Link>
        </div>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productName" className="text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                defaultValue={product?.name}
                id="productName"
                ref={nameRef}
                onChange={changeHandler}
                name="productName"
                placeholder="Enter product name"
                required
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600 p-3"
              />
            </div>
            <div>
              <label htmlFor="productSlug" className="text-sm font-medium text-gray-700">
                Product Slug
              </label>
              <input
                type="text"
                defaultValue={product?.slug}
                id="productSlug"
                ref={slugRef}
                name="productSlug"
                readOnly
                placeholder="example-product-name"
                required
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600 p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="originalPrice" className="text-sm font-medium text-gray-700">
                Original Price
              </label>
              <input
                type="number"
                defaultValue={product?.originalPrice}
                id="originalPrice"
                name="originalPrice"
                ref={originalPriceRef}
                onChange={finalPrice}
                placeholder="1000"
                required
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600 p-3"
              />
            </div>
            <div>
              <label htmlFor="discountPrice" className="text-sm font-medium text-gray-700">
                Discount Price
              </label>
              <input
                type="number"
                defaultValue={product?.discountPercentage}
                id="discountPrice"
                name="discountPrice"
                ref={discountPriceRef}
                onChange={finalPrice}
                placeholder="800"
                required
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600 p-3"
              />
            </div>
            <div>
              <label htmlFor="finalPrice" className="text-sm font-medium text-gray-700">
                Final Price
              </label>
              <input
                type="number"
                defaultValue={product?.finalPrice}
                id="finalPrice"
                name="finalPrice"
                ref={finalPriceRef}
                readOnly
                placeholder="750"
                required
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600 p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                name="categoryId"

                options={
                  category?.map(
                    (cat, i) => {
                      return { value: cat._id, label: cat.name }
                    }
                  )

                } />

            </div>
            <div>
              <label htmlFor="color" className="text-sm font-medium text-gray-700">
                Color
              </label>
              <Select
                onChange={
                  (color) => {
                    const selColor = color.map(o => o.value)
                    setSelColors(selColor)

                  }
                }
                isMulti
                closeMenuOnSelect={false}
                options={
                  color?.map(
                    (col, i) => {
                      return { value: col._id, label: col.name }
                    }
                  )

                } />
            </div>
            <div>
              <label htmlFor="brand" className="text-sm font-medium text-gray-700">
                Brand
              </label>
              <Select
                name="brandId"
                options={
                  brand?.map(
                    (brand, i) => {
                      return { value: brand._id, label: brand.name }
                    }
                  )

                } />

            </div>
          </div>

          <div>
            <label htmlFor="shortDesc" className="text-sm font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              id="shortDesc"
              defaultValue={product?.shortDescription}
              name="shortDesc"
              rows="3"
              placeholder="Brief description of the product"
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600 p-3"
            ></textarea>
          </div>

          <div>
            <label htmlFor="longDesc" className="text-sm font-medium text-gray-700">
              Long Description
            </label>
            <RichTextEditor value={description} change={
              (des) => {

                setdiscription(des)
              }

            } />
          </div>

          <div>
            <label htmlFor="productImage" className="text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              id="productImage"
              name="productImage"
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600 p-3"
            />
          </div>

          <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${product?.thumbnail}`} height="100px" width="100px" alt="" />


          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition"
            >
              <FaPlus />
              save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}