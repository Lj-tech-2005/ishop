'use client';
import { axiosApiInstance } from '@/app/library/helper';
import { setAdmin } from '@/redux/features/adminSlice';
import { removeAdmin} from '@/redux/features/userSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaEnvelope,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const admin = useSelector((state) => state.admin);
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const lsadmin = localStorage.getItem('admin');
    const loginAt = localStorage.getItem('loginAt');

    if (lsadmin) {
      dispatch(
        setAdmin({
          admin: JSON.parse(lsadmin),
          loginAt,
        })
      );
    }

    if (loginAt) {
      const date = new Date(loginAt);
      setFormattedTime(date.toLocaleString());
    }
  }, []);

  const logouthandler = (e) => {
    e.preventDefault();
    axiosApiInstance
      .get('admin/logout', { withCredentials: true })
      .then(() => {
        dispatch(removeAdmin());
        router.push('/admin-login');
      })
      .catch(() => {});
  };

  return (
    <header className="bg-[#2e3f5a] fixed top-0 z-10 w-[80%] px-6 py-4 flex justify-between items-center shadow-lg text-white">
      {/* Left section (optional search or title) */}
      <div className="flex items-center gap-4 flex-1">
        {/* Optional: Page title or logo */}
        <h1 className="text-xl font-semibold tracking-wide">Admin Dashboard</h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6 text-base">
        {/* Icons */}
        <div className="relative group cursor-pointer">
          <FaEnvelope className="hover:text-orange-400 transition duration-300" />
          <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs font-semibold rounded-full px-1.5">
            16
          </span>
        </div>

        <div className="relative group cursor-pointer">
          <FaBell className="hover:text-teal-400 transition duration-300" />
          <span className="absolute -top-2 -right-3 bg-teal-500 text-white text-xs font-semibold rounded-full px-1.5">
            8
          </span>
        </div>

        <FaCog className="cursor-pointer hover:text-blue-400 transition duration-300" />

        {/* Logout */}
        <div
          onClick={logouthandler}
          className="flex items-center gap-2 cursor-pointer text-sm hover:text-red-400 transition duration-300"
        >
          <FaSignOutAlt />
          <span>Log out</span>
        </div>

        {/* Admin info */}
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl text-gray-300" />
          <div className="flex flex-col text-right">
            <span className="font-medium text-sm text-white">
              Hi, {admin?.data?.name || 'Admin'}
            </span>
            <span className="text-xs text-gray-400">{formattedTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
