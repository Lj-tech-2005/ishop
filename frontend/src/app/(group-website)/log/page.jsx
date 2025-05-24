import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-[523.3900146484375px] max-w-[1360px]  mx-auto py-5">
    
      <div className="bg-[#FFFFFF] p-7 rounded-[10px] mb-6 text-[14px] text-[#999999] font-bold">
        Home / pages / <span className="text-black font-semibold">login</span>
      </div>

    
      <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
     
        <div className="flex justify-center items-center bg-white p-6">
          <Image
            src="/login.png" 
            alt="Login Illustration"
            width={400}
            height={300}
            className="object-contain w-[401.3299865722656px] h-auto"
          />
        </div>

     
        <div className="p-8 sm:p-10">
          <h2 className="text-[28px] font-bold text-[#01A49E]">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6 uppercase">Login to continue</p>

          <form className="space-y-5">
         
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

         
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="mt-1">
                <a href="#" className="text-xs text-gray-500 hover:underline">
                  Forget Password ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#01A49E] text-[14px] text-white py-2 p-6 cursor-pointer rounded-[10px] hover:bg-teal-700 transition"
            >
              LOGIN
            </button>
          </form>

         
          <p className="text-sm mt-6 text-center text-gray-600">
            NEW USER ? <a href="#" className="text-[#1ABA1A] font-semibold hover:underline">SIGN UP</a>
          </p>
        </div>
      </div>
    </div>
  );
}
