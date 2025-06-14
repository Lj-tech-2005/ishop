'use client'

import { useEffect, useState } from 'react';
import { axiosApiInstance, notify } from '@/app/library/helper';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getproduct } from '@/app/library/api-call';

export default function ProductImageManager() {
    const { product_id } = useParams();
    const [images, setImages] = useState([]);

    const fetchImages = async () => {
        const response = await getproduct(product_id);
        // setImages(response?.products?.images);
        setImages(response?.products?.images)
    };

    console.log(images, "image me")
    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let file of e.target.multiImage.files) {
            formData.append('images', file);
        }

        const res = await axiosApiInstance.post(`/product/multi-images/${product_id}`, formData);
        notify(res.data.msg, res.data.flag);
        if (res.data.flag === 1) {
            fetchImages();
            e.target.reset();
        }
    };

    const deleteImage = async (imgName) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const res = await axiosApiInstance.post(`/product/delete-image/${product_id}`, {
                imageName: imgName,
            });

            notify(res.data.msg, res.data.flag);
            if (res.data.flag === 1) {
                setImages(images.filter((img) => img !== imgName));
            }
        } catch (err) {
            console.error(err);
            notify('Failed to delete image', 0);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
            <h2 className="text-2xl font-bold text-center">Manage Product Images</h2>

            <form onSubmit={handleUpload} className="space-y-4">
                <label className="block font-semibold text-gray-700">Upload Images:</label>
                <input
                    type="file"
                    name="multiImage"
                    multiple
                    accept="image/*"
                    className="w-full border border-gray-300 p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Upload
                </button>
            </form>

            <div className="grid grid-cols-3 gap-4">
                {images?.map((img, index) => (
                    <div key={index} className="relative group">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${img}`}
                            alt={`Product Image ${index}`}
                            width={200}
                            height={150}
                            className="rounded-lg border"
                        />
                        <button
                            onClick={() => deleteImage(img)}
                            className="absolute top-1 cursor-pointer right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}