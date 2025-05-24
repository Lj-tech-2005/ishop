'use client'
import React, { useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { useState } from 'react';
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { MdShoppingCart } from "react-icons/md";
import { lstocart } from '@/redux/features/cartSlice';
import { logoutUser, lstoUser } from '@/redux/features/userSlice';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter()
    const cart = useSelector((state) => state.cart);
    const user = useSelector((state) => state.user);
    const dispatcher = useDispatch()
    const [toggle, settoggle] = useState(false);

    useEffect(() => {
        dispatcher(lstocart());
        dispatcher(lstoUser());
    }, [])


    function logoutHandler() {
        dispatcher(logoutUser());
        router.push("/login")
    }




    return (

        <header className=" bg-white ">
            <div className="max-w-[1360px] mx-auto p-2 md:p-4 rounded-[10px]">
                {/* Top Info Bar */}
                <div className="hidden md:flex flex-col sm:flex-row justify-between px-2 sm:px-5 gap-2 sm:gap-0">
                    <div className="flex justify-between sm:justify-start gap-2 sm:gap-4">
                        <span className="bg-[#EBEEF6] rounded-[6px] font-normal text-[12px] px-2 py-1">Hotline 24/7</span>
                        <span className="text-[12px] px-2 py-1 font-bold">(025) 3886 25 16</span>
                    </div>
                    <div className="flex justify-between sm:justify-end items-center gap-3 sm:gap-5">
                        <span className="text-[14px] font-normal">Sell on Swoo</span>
                        <span className="text-[14px] font-normal">Order Track</span>
                        <button className="text-[14px] font-normal border-r-2 px-2 border-[#99999999]">USD</button>
                        <button className="text-[14px] gap-2 flex items-center font-normal px-2">
                            <img src="/eng.png" alt="" className="w-4 h-4" />
                            Eng
                            <IoIosArrowDown />
                        </button>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="mt-5 flex flex-wrap md:flex-nowrap  items-start lg:items-center justify-between gap-4 px-2 sm:px-5">
                    {/* Logo + Menu */}
                    <div className="flex justify-between md:justify-normal gap-4 w-full">


                        <div className="flex cursor-pointer items-center gap-2">
                            <span className="bg-[#01A49E] rounded-4xl h-[49px] w-[55px] flex justify-center items-center">
                                <img className="mt-2" src="/vector1.png" alt="" />
                            </span>
                            <div className="text-[14px] leading-3.5 font-bold">
                                <p>SWOO</p>
                                <p>TECH MART</p>
                            </div>
                        </div>
                        <ul className="hidden items-center  cursor-pointer md:flex flex-wrap gap-4 text-[14px] font-bold">
                            <Link href={"/"}>
                                <li className="flex  items-center gap-1">Home</li>
                            </Link>
                            <li className="flex items-center gap-1">Pages<IoIosArrowDown className="mt-1" /></li>
                            <Link href={"/store"}><li className="flex items-center gap-1">Store<IoIosArrowDown className="mt-1" /></li></Link>

                            <li>Contact</li>
                        </ul>

                        {
                            toggle ?
                                <IoClose onClick={() => settoggle(!toggle)} className='text-3xl text-black cursor-pointer block md:hidden' />
                                :
                                <FaBars onClick={() => settoggle(!toggle)} className='text-3xl text-black cursor-pointer block md:hidden' />


                        }


                    </div>







                    <div className={`md:hidden bg-black fixed z-10 top-0 ${toggle ? "left-0" : "left-[-100%]"}  duration-500 p-5 text-white w-[50vw]  h-screen flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-9`}>

                        <ul className="flex flex-col flex-wrap gap-4 text-[14px] font-bold">
                            <Link href={"/"}>
                                <li className="flex cursor-pointer  items-center gap-1">Home</li>
                            </Link>
                            <li className="flex items-center gap-1">Pages<IoIosArrowDown className="mt-1" /></li>
                            <Link href={"/store"}><li className="flex items-center gap-1">Store<IoIosArrowDown className="mt-1" /></li></Link>
                            <li>Contact</li>
                        </ul>
                    </div>





                    {/* Login + Cart */}
                    <div className="flex gap-4 sm:gap-5 items-center">
                        <div className="uppercase text-left">
                            {
                                user.data != null ?
                                    <>
                                        <div className="text-xs text-gray-500">{user?.data?.name}</div>
                                        <div onClick={logoutHandler} className="font-semibold cursor-pointer hover:underline">
                                            LOGOUT
                                        </div>
                                    </>

                                    :
                                    <>
                                        <div className="text-xs text-gray-500">WELCOME</div>
                                        <Link href="/login?ref=header">
                                            <div className="font-semibold cursor-pointer hover:underline">
                                                LOG IN / REGISTER
                                            </div>
                                        </Link>


                                    </>
                            }

                        </div>
                        <Link href={"/cart"}>
                            <div className="flex gap-2 items-center">
                                <div className="bg-[#EBEEF6] text-2xl w-[40px] h-[40px] relative rounded-[20px] flex items-center justify-center">
                                    <MdShoppingCart />
                                    <span className="bg-[#01A49E] rounded-[10px] text-white text-[11px] absolute bottom-[-8px] right-[-5px] flex items-center justify-center w-[20px] h-[20px]">{cart?.items.length}</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-[#666666] text-[11px] font-normal uppercase">cart</p>
                                    {/* <p className="text-[10px] md:text-[14px] font-bold">$1,689.00</p> */}
                                </div>
                            </div>

                        </Link>
                    </div>


                </nav>
            </div>

            {/* Bottom Search + Info */}
            <div className='bg-[#01A49E] '>
                <div className="rounded-[10px] mx-auto max-w-[1360px] gap-3 md:gap-5 flex flex-col md:flex-row items-center justify-between p-3 px-4 ">
                    {/* Search Bar */}
                    <div className="w-full md:w-[50%] flex gap-2 rounded-3xl p-2 items-center bg-white">
                        <div className="text-[13px] whitespace-nowrap flex items-center gap-2 font-bold">
                            All Categories <IoIosArrowDown className="mt-1" />
                        </div>
                        <input className="text-[13px] outline-none p-1 w-full" type="text" placeholder="Search anything..." />
                        <IoMdSearch className="text-[18px]" />
                    </div>

                    {/* Info Text */}
                    <div className="hidden  font-medium md:flex flex-wrap md:flex-nowrap text-white justify-center md:justify-around gap-2 w-full md:w-[50%] uppercase text-[13px] text-center">
                        <p>free shipping over $199</p>
                        <p>30 days money back</p>
                        <p>100% secure payment</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
