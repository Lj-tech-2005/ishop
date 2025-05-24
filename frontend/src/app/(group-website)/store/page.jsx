import { getproduct } from '@/app/library/api-call';
import AddToCart from '@/components/website/addToCart';
import { FaTag } from 'react-icons/fa';

const ProductCard = async ({ searchParams }) => {
    const response = await getproduct(null, null, searchParams?.color, searchParams?.limit, searchParams?.minPrice, searchParams?.maxPrice);
    const products = response?.products || [];

    return (
        <div className="max-w-[1360px] p-4">
            {products.length === 0 ? (
                <div className="text-center text-gray-500 text-lg py-20">
                    Product not found
                </div>
            ) : (
                <div className="grid max-w-[1360px] p-2  grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white p-4">
                            <div className="relative">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${product.thumbnail}`}
                                    alt={product.name}
                                    className="w-full h-56 object-cover rounded-xl"
                                />
                                {product.discountPercentage > 0 && (
                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        -{product.discountPercentage}%
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>

                                <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                    <FaTag className="text-gray-400" />
                                    Category: {product.categoryId?.name}
                                </p>

                                <p className="text-sm text-gray-600 truncate">
                                    {product.shortDescription}
                                </p>

                                {product.colors?.length > 0 && (
                                    <div className="flex items-center gap-2 mt-2">
                                        {product.colors.map((color, idx) => (
                                            <span
                                                key={idx}
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: color.Hexcode }}
                                                title={color.name || color.Hexcode}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xl font-bold text-blue-600">
                                        {product.finalPrice}
                                    </span>
                                    {product.originalPrice > product.finalPrice && (
                                        <span className="text-sm line-through text-gray-400">
                                            {product.originalPrice}
                                        </span>
                                    )}
                                </div>

                                <AddToCart product={product} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductCard;
