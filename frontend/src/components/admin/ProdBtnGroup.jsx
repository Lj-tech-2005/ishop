
'use client'
import Swal from 'sweetalert2'
import { axiosApiInstance, notify } from '@/app/library/helper';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function ProdBtnGroup({ product }) {

    const [toggle, settoggle] = useState(null)

    console.log(product)

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
                        <button className="text-blue-500 cursor-pointer hover:text-blue-700" title="View">
                            Image
                        </button>

                    </Link>
                    <button onClick={() => settoggle(product)} className="text-blue-500  cursor-pointer  hover:text-blue-700" title="View">
                        <FaEye className="text-base" />
                    </button>
                    <Link href={`/admin/product/edit/${product._id}`}>
                        <button className="text-yellow-500 cursor-pointer hover:text-yellow-600" title="Edit">
                            <FaEdit className="text-base" />
                        </button>
                    </Link>
                    <button onClick={() => { deletehandler(product._id) }} className="text-red-500 cursor-pointer hover:text-red-700" title="Delete">
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg relative p-10 space-y-4 max-h-[90vh] overflow-y-auto overflow-x-hidden ">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-red-500 transition"
                >
                    <FaTimesCircle className="w-6 h-6" />
                </button>

                {/* Thumbnail */}
                {product.thumbnail && (
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${product.thumbnail}`}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                )}

                {/* Product Name & Slug */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                    <p className="text-sm text-gray-500">Slug: {product.slug}</p>
                </div>

                {/* Price Info */}
                <div className="space-y-1">
                    <p><span className="font-semibold">Original Price:</span> ₹{product.originalPrice}</p>
                    <p><span className="font-semibold">Discount:</span> {product.discountPercentage}%</p>
                    <p><span className="font-semibold text-green-700">Final Price:</span> ₹{product.finalPrice}</p>
                </div>

                {/* Descriptions */}
                <div>
                    <p className="text-gray-700">
                        <span className="font-semibold text-wrap">Short Description:</span> {product.shortDescription}
                    </p>
                    <div className="text-gray-700 mt-2">
                        <p className="font-semibold">Long Description:</p>
                        <div
                            className="mt-1 prose prose-sm max-w-none break-words"
                            dangerouslySetInnerHTML={{ __html: product.longDescription }}
                        />
                    </div>
                </div>

                {/* Stock & Colors */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <p><span className="font-semibold">Stock:</span> {product.stock ? 'Available' : 'Out of Stock'}</p>
                    </div>
                    <div>
                        <p className='flex gap-6'>
                            Colors:
                            {
                                product?.colors?.map((color,i) => {

                                    return (

                                        <span className='p-2' key={i} style={{ background: color.Hexcode }}></span>
                                    )

                                })
                            }
                        </p>
                    </div>
                    <div>
                        <p><span className="font-semibold">Category:{product?.categoryId?.name}</span></p>
                    </div>
                </div>

                {/* Gallery */}
                {product.images?.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Gallery</h3>
                        <div className="flex gap-2 overflow-x-auto">
                            {product.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${img}`}
                                    alt={`img-${i}`}
                                    className="h-24 w-24 object-cover rounded-md border"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



