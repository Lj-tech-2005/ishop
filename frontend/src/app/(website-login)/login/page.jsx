'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { axiosApiInstance } from '@/app/library/helper';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/userSlice';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const params = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const lsCart = JSON.parse(localStorage.getItem('cart'));
    const cart = lsCart ? lsCart.items : null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        axiosApiInstance.post("user/login", data).then(
            async (res) => {
                if (res.data.flag === 1) {

                    console.log(res)
                    dispatch(setUser({

                        data: res.data.user,
                        token: res.data.token

                    }));



                    const updatedCart = await axiosApiInstance.post("cart/move-to-db", {
                        user_id: res.data?.user?._id,
                        cart: cart != null ? cart : null
                    })

                    console.log(updatedCart.data, "cart")
                    let final_total = 0;
                    let original_total = 0;
                    console.log(updatedCart, "updatedCart")
                    const dbCart = updatedCart.data?.cart?.map(
                        (cd) => {
                            final_total += ((cd.product_id?.finalPrice) * cd.qty);
                            original_total += ((cd.product_id?.originalPrice) * cd.qty);

                            return {
                                productId: cd.product_id._id,
                                qty: cd.qty
                            }


                        }
                    )

                    console.log(dbCart, final_total, original_total)

                    localStorage.setItem("cart", JSON.stringify({
                        items: dbCart, final_total, original_total
                    }))



                    if (params.get("ref") === "checkout") {
                        router.push("/checkout")
                    } else {
                        router.push("/")

                    }
                }
            }
        ).catch(
            (err) => {

                console.log(err)
            }
        )

    }









    return (
        <>
            <h2 className="text-[28px] font-bold text-[#01A49E]">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6 uppercase">Login to continue</p>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm mb-1">Email Address</label>
                    <input
                        type="email"
                        name='email'
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        name='password'
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="mt-1">
                        <a href="#" className="text-xs text-gray-500 hover:underline">Forget Password ?</a>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-[#01A49E] text-[14px] text-white py-2 px-6 cursor-pointer rounded-[10px] hover:bg-teal-700 transition"
                >
                    LOGIN
                </button>
            </form>
        </>
    );
}

function RegisterForm() {
    const router = useRouter()
    const dispatch = useDispatch();
    const registerSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        axiosApiInstance.post("user/register", data).then(
            (res) => {
                if (res.data.flag === 1) {

                    console.log(res)
                    dispatch(setUser({

                        data: res.data.user,
                        token: res.data.token

                    }));
                    router.push("/")
                }
            }
        ).catch(
            (err) => {

                console.log(err)
            }
        )

    }
    return (
        <>
            <h2 className="text-[28px] sm:text-3xl font-bold text-teal-600 mb-2">Register</h2>
            <p className="text-gray-500 text-sm sm:text-base mb-6">JOIN TO US</p>
            <form onSubmit={registerSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Your name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Jhon Deo"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        name='password'
                        type="password"
                        placeholder="••••••••"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none"
                    />
                </div>
                {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        name="confirmpassword"
                        type="password"
                        placeholder="••••••••"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none"
                    />
                </div> */}
                <button
                    type="submit"
                    className="p-5 bg-[#01A49E] text-[14px] cursor-pointer hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    REGISTER
                </button>
            </form>
        </>
    );
}

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen max-w-[1360px] mx-auto py-5">
            {/* Breadcrumb */}
            <div className="bg-white p-7 rounded-[10px] mb-6 text-[14px] text-[#999999] font-bold">
                Home / pages / <span className="text-black cursor-pointer font-semibold">{isLogin ? 'Login' : 'Register'}</span>
            </div>

            {/* Toggle Buttons */}
            <div className="flex cursor-pointer justify-center mb-6">
                <button
                    className={`px-6 cursor-pointer py-2 text-sm font-bold rounded-l-full ${isLogin ? 'bg-[#01A49E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button
                    className={`px-6 cursor-pointer py-2 text-sm font-bold rounded-r-full ${!isLogin ? 'bg-[#01A49E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setIsLogin(false)}
                >
                    Register
                </button>
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-xl  p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="w-full lg:w-1/2 flex justify-center">
                    <Image
                        src="/login.png"
                        alt="Auth Illustration"
                        width={400}
                        height={300}
                        className="object-contain w-[401.3299865722656px] h-auto"
                        priority
                    />
                </div>

                <div className="w-full lg:w-1/2">
                    {isLogin ? <LoginForm /> : <RegisterForm />}

                    {/* Switch link below form */}
                    <p className="text-sm mt-6 text-center text-gray-600">
                        {isLogin ? (
                            <>NEW USER?{' '}<button onClick={() => setIsLogin(false)} className="text-[#1ABA1A] font-semibold hover:underline">SIGN UP</button></>
                        ) : (
                            <>Already a user?{' '}<button onClick={() => setIsLogin(true)} className="text-[#1ABA1A] font-semibold hover:underline">LOGIN</button></>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
