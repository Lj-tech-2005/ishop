
'use client'

import React, { useRef } from "react";
import Link from "next/link";
import { axiosApiInstance, createSlug, notify } from "@/app/library/helper";


const AddBrand = () => {

    const nameref = useRef()
    const slugref = useRef()

    const changehandler = () => {

        const slug = createSlug(nameref.current.value)
        slugref.current.value = slug
    }


    const submithandler = (e) => {

        e.preventDefault();

        const formdata = new FormData();

        formdata.append("name", nameref.current.value)
        formdata.append("slug", slugref.current.value)
        formdata.append("brandImage", e.target.brandImage.files[0])


        axiosApiInstance.post("brand/create", formdata).then(


            (res) => {

                notify(res.data.msg, res.data.flag)
                if (res.data.flag === 1) {

                    e.target.reset()
                }
            }

        ).catch(

            (err) => {

                console.log(err)

            }
        )
    }




    return (
        <div className="min-h-screen  bg-gray-100 dark:bg-gray-900 pt-20 px-6">
            <div className="max-w-3xl mx-auto bg-white dark:bg-[#1e293b] shadow-xl rounded-2xl p-8">

                <div className="flex items-center justify-between mb-8">
                    <Link href={"/admin/brand"}>
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
                            Back to Brand
                        </button>

                    </Link>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Add New Brand
                    </h1>
                </div>


                <form onSubmit={submithandler} className="space-y-6">

                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2">
                            Name
                        </label>
                        <input
                            ref={nameref}
                            onChange={changehandler}
                            name="name"
                            type="text"
                            placeholder="Enter Brand name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2">
                            Name slug
                        </label>
                        <input
                            ref={slugref}
                            name="name"
                            readOnly
                            type="text"
                            placeholder="Enter Brand slug"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2">
                            image
                        </label>
                        <input

                            name="brandImage"
                            type="file"
                            placeholder="Enter brand image"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href={"/admin/brand"}>
                            <button
                                type="button"
                                className="px-5 cursor-pointer  py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 transition"
                        >
                            Add Brand
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBrand;
