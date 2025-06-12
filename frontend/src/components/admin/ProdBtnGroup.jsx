
'use client'
import Swal from 'sweetalert2'
import { axiosApiInstance, notify } from '@/app/library/helper';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function ProdBtnGroup({ product }) {

    console.log(product)
    const [toggle, settoggle] = useState(null)


    const router = useRouter()

    const statushandler = (id, flag) => {

        axiosApiInstance.patch(`product/status/${id}`, { flag }).then(

            (response) => {
                notify(response.data.msg, response.data.flag)
                if (response.data.flag === 1) {

                    router.refresh()

                }

            }

        ).catch(

            (err) => {

                console.log(err)
                notify("something went is wrong", 0)

            }

        )


    }

    const deletehandler = (id) => {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });

                axiosApiInstance.delete(`product/delete/${id}`).then(

                    (response) => {
                        notify(response.data.msg, response.data.flag)
                        if (response.data.flag === 1) {

                            router.refresh()

                        }

                    }

                ).catch(

                    (err) => {

                        console.log(err)
                        notify("something went is wrong", 0)

                    }

                )
            }
        });
    }



    return (
        <>
            <td className="px-4 py-3 whitespace-nowrap">
                <span onClick={() => { statushandler(product._id, 1) }} className={`px-2 cursor-pointer py-1 text-xs rounded-full font-semibold ${product.stock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {product.stock ? "In Stock" : "Out of Stock"}
                </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <span onClick={() => { statushandler(product._id, 2) }} className={`inline-block cursor-pointer w-11 h-6 rounded-full relative ${product.topSelling ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition transform ${product.topSelling ? 'translate-x-full' : ''}`} />
                </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">

                <span onClick={() => { statushandler(product._id, 3) }} className={`inline-block cursor-pointer w-11 h-6 rounded-full relative ${product.status ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition transform ${product.status ? 'translate-x-full' : ''}`} />
                </span>

            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                    <Link href={`/admin/product/multipalimage/${product._id}`}>
                        <button className="text-black p-2 rounded  bg-amber-600 cursor-pointer " title="multipalimage">
                            Image
                        </button>

                    </Link>
                    <button onClick={() => settoggle(product)} className="text-black p-1 flex flex-col items-center rounded bg-amber-200   cursor-pointer  hover:text-blue-700" title="View">
                        <FaEye className="text-base" />
                        view
                    </button>
                    <Link href={`/admin/product/edit/${product._id}`}>
                        <button className="text-yellow-500 cursor-pointer flex flex-col justify-center bg-black p-2 py-1 rounded hover:text-yellow-600" title="Edit">
                            <FaEdit className="text-base" />
                            Edit
                        </button>
                    </Link>
                    <button onClick={() => { deletehandler(product._id) }} className="text-red-500 bg-teal-300 p-2 py-3 rounded cursor-pointer hover:text-red-700" title="Delete">
                        <FaTrash className="text-base" />
                    </button>
                </div>

                {toggle && <ProductDetail product={toggle} onClose={() => settoggle(null)} />}

            </td>
        </>
    )
}




// optional: or use emoji/icon if you don’t want lucide





const ProductDetail = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto overflow-x-hidden">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 cursor-pointer right-4 text-gray-600 hover:text-red-500 z-10"
      >
        <FaTimesCircle className="w-6 h-6" />
      </button>

      {/* Page Container */}
      <div className="w-full max-w-3xl mx-auto pt-16 px-4 pb-16 space-y-8 overflow-x-hidden">
        {/* Thumbnail */}
        {product.thumbnail && (
          <div className="flex justify-center">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${product.thumbnail}`}
              alt={product.name}
              className="w-full max-w-md h-auto object-contain rounded-lg shadow"
            />
          </div>
        )}

        {/* Product Name & Slug */}
        <div className="text-center px-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words whitespace-normal overflow-hidden max-w-full">
            {product.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1 break-words whitespace-normal overflow-hidden max-w-full">
            Slug: {product.slug}
          </p>
        </div>

        {/* Price Info */}
        <div className="bg-gray-100 p-4 rounded-lg space-y-2 text-sm sm:text-base">
          <p>
            <span className="font-semibold">Original Price:</span> ₹{product.originalPrice}
          </p>
          <p>
            <span className="font-semibold">Discount:</span> {product.discountPercentage}%
          </p>
          <p className="text-green-700 font-bold text-lg">
            Final Price: ₹{product.finalPrice}
          </p>
          <p>
            <span className="font-semibold">Stock:</span>{" "}
            <span className={product.stock ? "text-green-600" : "text-red-600"}>
              {product.stock ? "Available" : "Out of Stock"}
            </span>
          </p>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <p>
            <span className="font-semibold">Category:</span> {product.categoryId?.name}
          </p>
          <p>
            <span className="font-semibold">Brand:</span> {product.brandId?.name || "N/A"}
          </p>
        </div>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div>
            <p className="font-semibold mb-2">Colors:</p>
            <div className="flex gap-2">
              {product.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border shadow"
                  style={{ backgroundColor: color.Hexcode }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Short Description */}
        <div>
          <p className="font-semibold">Short Description:</p>
          <p className="text-gray-700 text-sm mt-1 break-words whitespace-pre-wrap">
            {product.shortDescription}
          </p>
        </div>

        {/* Long Description */}
        <div>
          <p className="font-semibold">Long Description:</p>
          <div
            className="prose prose-sm text-gray-700 max-w-none mt-1 break-words whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: product.longDescription }}
          />
        </div>

        {/* Gallery Images */}
        {product.images?.length > 0 && (
          <div>
            <p className="font-semibold mb-2">Gallery:</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${img}`}
                  alt={`img-${i}`}
                  className="h-24 w-24 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


