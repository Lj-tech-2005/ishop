'use client';
import React from 'react';
import {
  FaBoxes,
  FaUsers,
  FaTags,
  FaChartLine,
} from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="min-h-screen  mt-15 bg-gray-100 dark:bg-[#0f172a] p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here’s a quick summary of your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">12</h2>
            </div>
            <FaTags className="text-blue-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">84</h2>
            </div>
            <FaBoxes className="text-green-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">1,023</h2>
            </div>
            <FaUsers className="text-purple-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Performance</p>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">+12.5%</h2>
            </div>
            <FaChartLine className="text-orange-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Placeholder for Charts or Recent Activity */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow h-60 flex items-center justify-center text-gray-400 dark:text-gray-500">
          📊 Chart Placeholder
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow h-60 flex items-center justify-center text-gray-400 dark:text-gray-500">
          📝 Recent Activity
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
