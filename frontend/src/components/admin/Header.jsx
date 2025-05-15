'use client';
import { axiosApiInstance } from '@/app/library/helper';
import { useRouter } from 'next/navigation';
import {
  FaBars,
  FaEnvelope,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaThList,
} from 'react-icons/fa';

export default function Header() {

  const router = useRouter()
  const logouthandler = (e) => {

    e.preventDefault();
    axiosApiInstance.get("admin/logout", { withCredentials: true })
    router.push("/admin-login")
  }



  return (
    <header className=" bg-[#2b3e4e] fixed top-0 z-10 w-[85%]   text-gray-300 px-4 pe-35   py-3 flex">
      {/* Left section */}
      <div className="flex items-center space-x-4 flex-1 min-w-[200px]">
        <button className="bg-teal-500 p-2 rounded text-white">
          <FaBars />
        </button>
        <input
          type="text"
          placeholder="Search for something..."
          className="bg-transparent border-none outline-none placeholder-gray-400 text-sm w-full"
        />
      </div>

      {/* Center
      <div className="hidden md:block text-sm text-gray-400 mx-auto">
        Welcome to <span className="text-white font-medium">INSPINIA+ Admin Theme</span>.
      </div> */}

      {/* Right section */}
      <div className="flex items-center space-x-6 text-lg">
        <div className="relative cursor-pointer">
          <FaEnvelope />
          <span className="absolute -top-2 -right-3 bg-orange-400 text-white text-xs rounded px-1.5">
            16
          </span>
        </div>

        <div className="relative cursor-pointer">
          <FaBell />
          <span className="absolute -top-2 -right-3 bg-teal-400 text-white text-xs rounded px-1.5">
            8
          </span>
        </div>

        <FaCog className="cursor-pointer" />
        <div
          onClick={logouthandler}
          className="flex items-center gap-1 cursor-pointer text-sm">
          <FaSignOutAlt />
          <span>Log out</span>
        </div>
        <FaThList className="cursor-pointer" />
      </div>
    </header>
  );
}
