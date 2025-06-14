import { getproduct } from '@/app/library/api-call';
import AddToCart from '@/components/website/addToCart';
import Pagination from '@/components/website/Pagination';

const Productslug = async ({ params, searchParams }) => {
    const limit = parseInt(searchParams?.limit) || 12;
    const page = parseInt(searchParams?.page) || 1;
  const response = await getproduct(
    null,
    params?.category_slug,
    searchParams?.brand,
    searchParams?.color,
    limit,
    searchParams?.minPrice,
    searchParams?.maxPrice,
    page
   

  );
  const products = response?.products || [];


  return (
    <div className="max-w-[1360px] p-4">
      {products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-20">
          Product not found
        </div>
      ) : (
        <div className="grid max-w-[1360px] p-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-xl shadow-md flex flex-col h-[480px] justify-between"
            >
              {/* Image Section */}
              <div className="relative w-full h-[220px]">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${product.thumbnail}`}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-lg bg-gray-50"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow mt-4">
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2 leading-tight">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {product.shortDescription}
                </p>

                {/* Color Dots */}
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

                {/* Price + Button */}
                <div className="mt-auto pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-600">
                      ₹{product.finalPrice}
                    </span>
                    {product.originalPrice > product.finalPrice && (
                      <span className="text-sm line-through text-gray-400">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <AddToCart product={product} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      )}
      <Pagination total={response?.total} limit={limit} />
    </div>
  );
};

export default Productslug;