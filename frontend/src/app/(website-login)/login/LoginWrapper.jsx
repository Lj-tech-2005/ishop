'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { axiosApiInstance, notify } from '@/app/library/helper';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/userSlice';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm({ cart }) {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await axiosApiInstance.post('user/login', data);
      notify(res.data.msg, res.data.flag);

      if (res.data.flag === 1) {
        dispatch(setUser({ data: res.data.user, token: res.data.token }));

        const updatedCart = await axiosApiInstance.post('cart/move-to-db', {
          user_id: res.data?.user?._id,
          cart: cart || null,
        });

        let final_total = 0;
        let original_total = 0;

        const dbCart = updatedCart.data?.cart?.map((cd) => {
          final_total += cd.product_id?.finalPrice * cd.qty;
          original_total += cd.product_id?.originalPrice * cd.qty;
          return {
            productId: cd.product_id._id,
            qty: cd.qty,
          };
        });

        localStorage.setItem(
          'cart',
          JSON.stringify({ items: dbCart, final_total, original_total })
        );

        if (params.get('ref') === 'checkout') {
          router.push('/checkout');
        } else {
          router.push('/');
        }
      } else {
        setError(res.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-teal-600">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500" />
        <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500" />
        <span className="text-red-500 text-sm">{error}</span>
        <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition">
          LOGIN
        </button>
      </form>
    </>
  );
}

function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState();

  const registerSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await axiosApiInstance.post('user/register', data);
      notify(res.data.msg, res.data.flag);
      if (res.data.flag === 1) {
        dispatch(setUser({ data: res.data.user, token: res.data.token }));
        router.push('/');
      } else {
        setError(res.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-teal-600">Create Account</h2>
      <form onSubmit={registerSubmit} className="space-y-5 mt-4">
        <input name="name" type="text" placeholder="Your Name" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500" />
        <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500" />
        <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500" />
        <span className="text-red-500 text-sm">{error}</span>
        <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition">
          REGISTER
        </button>
      </form>
    </>
  );
}

export default function LoginWrapper() {
  const [isLogin, setIsLogin] = useState(true);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lsCart = JSON.parse(localStorage.getItem('cart'));
      setCart(lsCart ? lsCart.items : null);
    }
  }, []);

  return (
    <div className="min-h-screen max-w-[1360px] mx-auto py-8 px-4">
      <div className="bg-white p-6 sm:p-10 rounded-[10px]  flex flex-col lg:flex-row items-center gap-10">
        <div className="w-full lg:w-1/2">
          <Image
            src="/login.png"
            alt="Illustration"
            width={300}
            height={250}
            className="object-contain w-full h-auto"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2  font-semibold rounded-full cursor-pointer transition ${
                isLogin ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2  font-semibold rounded-full cursor-pointer transition ${
                !isLogin ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Register
            </button>
          </div>
          {isLogin ? <LoginForm cart={cart} /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
