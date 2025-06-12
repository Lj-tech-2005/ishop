'use client';
import { axiosApiInstance, notify } from '@/app/library/helper';
import { setUser } from '@/redux/features/userSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';




export default function Profile() {
  const [activeTab, setActiveTab] = useState('account');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const user = useSelector((state) => state.user.data);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();



  if (!user) {
    return <p>Loading...</p>; // या null या spinner
  }

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  console.log(user)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userId: ''
  });



  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        userId: user._id
      });
    }
  }, [user]);




  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosApiInstance.put('user/update-profile', formData);

      console.log(res)
      if (res.data.flag === 1) {
        dispatch(setUser({ data: res.data.user, token }));
        notify(res.data.msg, res.data.flag);
      } else {
        notify(res.data.msg, res.data.flag);
      }
    } catch (err) {
      console.log(err);
      notify('error', 'Something went wrong!');
    }
  };

  // for address


  const [shippingAddresses, setShippingAddresses] = useState([
    {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      contact: '',
    },
  ]);

  // Load user addresses
  useEffect(() => {
    if (user?.shipping_address) {
      setShippingAddresses(user.shipping_address.length ? user.shipping_address : shippingAddresses);
    }
  }, [user]);

  const handleAddressChange = (index, field, value) => {
    const updated = [...shippingAddresses];
    updated[index][field] = value;
    setShippingAddresses(updated);
  };

  const handleAddressSubmit = async (e, index) => {
    e.preventDefault();
    try {
      const payload = {
        ...shippingAddresses[index],
        index,
        userId: user._id,
      };
      const res = await axiosApiInstance.put('user/update-address', payload);

      if (res.data.flag === 1) {
        dispatch(setUser({ data: res.data.user, token }));
        if (res.data.user?.shipping_address) {
          setShippingAddresses(res.data.user.shipping_address);
        }
      }
      notify(res.data.msg, res.data.flag);
    } catch (err) {
      console.error(err);
      notify('Something went wrong', 0);
    }
  };

  const addNewAddress = () => {
    if (shippingAddresses.length < 3) {
      setShippingAddresses([
        ...shippingAddresses,
        {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          contact: '',
        },
      ]);
    }
  };
  /// for profile pic

  //  const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setPreview(URL.createObjectURL(file)); // Display preview
  //   }
  // }

  const handleUploadPhoto = async () => {
    if (!selectedFile || !user?._id) {
      return notify("Please select an image first", 0);
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);
    formData.append("userId", user._id);

    try {
      const res = await axiosApiInstance.put('user/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.flag === 1) {
        dispatch(setUser({ data: res.data.user, token }));
        setPreview(null); // optional: reset preview
        setSelectedFile(null);
        notify(res.data.msg, 1);
      } else {
        notify(res.data.msg, 0);
      }
    } catch (err) {
      console.error(err);
      notify("Image upload failed", 0);
    }
  };


  const TabButton = ({ tabKey, label }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`w-full flex items-center cursor-pointer justify-between px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === tabKey
        ? 'text-white bg-teal-500'
        : 'text-gray-700 bg-white border hover:bg-gray-100'
        }`}
    >
      {label} <span>→</span>
    </button>
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };



  /// for password 


  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });


  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

 const handlePasswordSubmit = async (e) => {
  e.preventDefault();

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    return notify('New Password and Confirm Password do not match', 'error');
  }

  try {
    const res = await axiosApiInstance.post('user/change-password', {
      ...passwordData,
      userId: user._id // include this
    });

    notify('Password changed successfully', 'success');

    // Optional: update Redux if your backend returns updated user
    dispatch(setUser(res.data.user));

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  } catch (err) {
    console.log(err);
    notify(err?.response?.data?.msg || 'Password change failed', 'error');
  }
};


  return (
    <div className="min-h-screen max-w-[1360px] mx-auto py-5">
      <div className="bg-[#FFFFFF] p-7 rounded-[10px] mb-6 text-[14px] text-[#999999] font-bold">
        Home / pages / <span className="text-black font-semibold">Profile</span>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 sm:p-10 flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-start">

            {preview ? (
              <img src={preview} alt="Preview" />
            ) : hasMounted && user?.profileImage ? (
              <img
                className='h-50 w-50 rounded-[50%]'
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/profile/${user.profileImage}`}
                alt="User Avatar"
                onError={(e) => (e.target.src = "/profile.png")}
              />
            ) : (
              <img src="/profile.png" alt="Default Avatar" />
            )}


            <input
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={handleImageChange}
            />

            <button
              onClick={handleUploadPhoto}  // ✅ अपलोड करने वाला फ़ंक्शन जो आपने backend से जोड़ा होगा
              className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition mb-4"
            >
              Upload Photo
            </button>

            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

            <div className="space-y-3  w-full">
              <TabButton tabKey="account" label="Account info" />
              <TabButton tabKey="order" label="My order" />
              <TabButton tabKey="address" label="My address" />
              <TabButton tabKey="password" label="Change password" />
            </div>
          </div>
        </div>

        {/* Main Tab Content */}
        <div className="w-full lg:w-2/3">
          {activeTab === 'account' && (
            <div>
              <h2 className="text-[24px] font-bold mb-6">Account Info</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 cursor-pointer bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  SAVE
                </button>
              </form>
            </div>
          )}
          {activeTab === 'address' && (
            <div>
              <h2 className="text-[24px] font-bold mb-6">My Address</h2>

              {shippingAddresses.map((address, index) => (
                <form
                  key={index}
                  className="space-y-5 mb-10 border border-gray-200 rounded-xl p-6"
                  onSubmit={(e) => handleAddressSubmit(e, index)}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)}
                      placeholder="123 Main St"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                    <input
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={(e) => handleaddChange(index, 'addressLine2', e.target.value)}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="city"
                        value={address.city}
                        onChange={(e) => handleaddChange(index, 'city', e.target.value)}
                        placeholder="Your city"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="state"
                        value={address.state}
                        onChange={(e) => handleaddChange(index, 'state', e.target.value)}
                        placeholder="Your state"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="postalCode"
                        value={address.postalCode}
                        onChange={(e) => handleaddChange(index, 'postalCode', e.target.value)}
                        placeholder="123456"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="country"
                        value={address.country}
                        onChange={(e) => handleaddChange(index, 'country', e.target.value)}
                        placeholder="Your country"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact (Optional)</label>
                    <input
                      name="contact"
                      value={address.contact}
                      onChange={(e) => handleaddChange(index, 'contact', e.target.value)}
                      placeholder="+91 9876543210"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-4 cursor-pointer bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                  >
                    Save Address
                  </button>
                </form>
              ))}

              {shippingAddresses.length < 3 && (
                <button
                  type="button"
                  onClick={addNewAddress}
                  className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                  + Add New Address
                </button>
              )}
            </div>
          )}




          {activeTab === 'password' && (
            <div>
              <h2 className="text-[24px] font-bold mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 cursor-pointer bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Change Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
