import { getproduct } from '@/app/library/api-call';
import ProdBtnGroup from '@/components/admin/ProdBtnGroup';
import Link from 'next/link';

const ProductTable = async () => {
    const response = await getproduct();
    const products = response?.products;

    return (
        <div className="mt-20">
             <div className="flex justify-between items-center px-5  mb-6">
                <h1 className="text-3xl font-bold  text-white">Product List</h1>
                <Link href={"/admin/product/add"}>
                    <button className="bg-amber-400 cursor-pointer text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-amber-500 transition">
                        + Add New Product
                    </button>
                </Link>
            </div>
            <div className="w-full bg-gray-50 rounded-xl shadow-lg ">
                <table className="table-auto w-full bg-white rounded-lg shadow-md text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left uppercase tracking-wider">
                            <th className="px-4 py-2 whitespace-nowrap">Thumbnail</th>
                            <th className="px-4 py-2 whitespace-nowrap">Name</th>
                            <th className="px-4 py-2 whitespace-nowrap">Slug</th>
                            <th className="px-4 py-2 whitespace-nowrap">Prices</th>
                            <th className="px-4 py-2 whitespace-nowrap">Stock</th>
                            <th className="px-4 py-2 whitespace-nowrap">Top Selling</th>
                            <th className="px-4 py-2 whitespace-nowrap">Status</th>
                            <th className="px-4 py-2 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((product, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${product.thumbnail}`}
                                        alt={product.name}
                                        className="w-14 h-14 rounded-lg object-cover"
                                    />
                                </td>
                                <td className="px-4 py-3 font-medium whitespace-nowrap">{product.name}</td>
                                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{product.slug}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex flex-col space-y-0.5 text-xs">
                                        <div className="text-gray-500">
                                            <span className="font-medium">Original:</span> ${product.originalPrice}
                                        </div>
                                        <div className="text-red-500">
                                            <span className="font-medium">Discount:</span> -{product.discountPercentage}%
                                        </div>
                                        <div className="text-green-600 font-semibold">
                                            <span className="font-medium">Final:</span> ${product.finalPrice}
                                        </div>
                                    </div>
                                </td>
                              <ProdBtnGroup  product={product} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;
