'use client'

import { useRouter } from "next/navigation";
import { axiosApiInstance } from "../library/helper";


export default function AdminLogin() {
    const router = useRouter()
    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {

            email: e.target.email.value,
            password: e.target.password.value

        }


        axiosApiInstance.post("admin/login", data ,{withCredentials:true}).then(
            (res) => {
                console.log(res)
                if(res.data.flag == 1){

                    router.push("/admin")

                }
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )

    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 mb-1" htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    © {new Date().getFullYear()} Admin Panel. All rights reserved.
                </p>
            </div>
        </div>
    );
}
