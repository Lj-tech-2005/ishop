import React from "react";
import Link from "next/link";
import { getColor } from "@/app/library/api-call";
import Status from "@/components/admin/Status";
import Delete from "@/components/admin/Delete";
const ColorList = async () => {


    const colorJSON = await getColor();
    const colordata = colorJSON?.colors;




    return (
        <div className="min-h-screen p-6 pt-20  dark:bg-gray-900">

            <div className="flex justify-between items-center max-w-6xl mx-auto mb-6">
                <h1 className="text-3xl font-bold  text-white">Color List</h1>
                <Link href={"/admin/color/add"}>
                    <button className="bg-amber-400 cursor-pointer text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-amber-500 transition">
                        + Add New Color
                    </button>
                </Link>
            </div>


            <div className="max-w-6xl mx-auto bg-white  dark:bg-[#1e2a38] shadow-xl rounded-t-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left">
                        <thead className="bg-gray-200 dark:bg-[#2e3b4e] text-gray-700 dark:text-gray-300  uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 border-b">ID</th>
                                <th className="px-6 py-4 border-b">Name</th>
                                <th className="px-6 py-4 border-b">Status</th>
                                <th className="px-6 py-4 border-b">Hexcode</th>
                                <th className="px-6 py-4 border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(colordata) && colordata.map((color, index) => {

                                    return (

                                        <tr key={index} className="bg-white  dark:bg-[#263447] hover:bg-gray-50 dark:hover:bg-[#324158] transition">
                                            <td className="px-6 py-4 border-b text-gray-800 dark:text-gray-200">{index + 1}</td>
                                            <td className="px-6 py-4 border-b text-gray-800 dark:text-gray-200">{color.name}</td>
                                            <td className="px-6 py-4 border-b">
                                                <Status statusUrl={`color/status/${color._id}`} Status={color.status} />
                                            </td>
                                            <td className="px-6  py-4 border-b">
                                                <span style={{ background: color.Hexcode }} className="p-2 px-4  rounded-full ">{color.Hexcode}</span>
                                            </td>
                                            <td className="px-6 py-4 border-b text-center space-x-2">
                                                <Link href={`/admin/color/edit/${color._id}`}>
                                                    <button className="px-4 py-1 text-white bg-blue-600 cursor-pointer rounded-md hover:bg-blue-700 transition">
                                                        Edit
                                                    </button>
                                                </Link>
                                                <Delete type="color" id={color._id} />
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>

                </div>
            </div >
        </div >
    );
};

export default ColorList;
