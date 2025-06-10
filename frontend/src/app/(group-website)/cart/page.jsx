'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getproduct } from "@/app/library/api-call";
import { qtyhandler, removetoCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { axiosApiInstance } from "@/app/library/helper";

export default function CartPage() {
  const router = useRouter()
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getProduct() {
    try {
      const response = await getproduct();
      const products = response?.products || [];
      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);


  function checkoutHandler() {
    if (user?.data) {
      router.push("/checkout")
    } else {
      router.push("/login?ref=checkout")
    }

  }

  const removehandler = async (item) => {

    if (user?.data) {

      try {

        const response = await axiosApiInstance.post("cart/remove", {

          userId: user?.data?._id,
          productId: item.productId

        });

        if (response.data.flag == 1) {

          console.log("Item removed from DB");
        } else {
          console.warn("DB removal failed:", response.data.msg);
        }


      } catch (error) {
        console.error("Failed to remove from DB", error);

      }

    }
    dispatch(
      removetoCart({
        productId: item.productId,
        final_price: item.final_price,
        original_price: item.original_price,
      })
    );
  };

  const handleQtyChange = async (productId, flag, finalPrice, originalPrice) => {
    const qtychange = flag === "inc" ? 1 : -1;



    // Call the new quantity update API
    if (user?.data) {
      try {
        await axiosApiInstance.post("cart/update-qty", {
          userId: user?.data._id,
          productId: productId, // ✅ Correct variable
          qtychange: qtychange,       // ✅ This is fine if API expects increment/decrement
        }).then(
          (res) => {
            console.log(res)
          }
        ).catch(
          (er) => {
            console.log(er)
          }
        )
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    }

    // Then update local Redux state
    dispatch(
      qtyhandler({
        productId,
        flag,
        final_price: finalPrice,
        original_price: originalPrice,
      })
    );
  };


  if (loading) {
    return (
      <div className="max-w-[1360px] mx-auto py-5 text-center text-gray-500">
        Loading cart products...
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto py-5">
      <div className="bg-[#FFFFFF] p-7 rounded-[10px] mb-6 text-[14px] text-[#999999] font-bold">
        Home / pages / <span className="text-black font-bold">Cart</span>
      </div>

      <div className="grid grid-cols-1 p-6 bg-[#FFFFFF] rounded-[10px] lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.length === 0 ? (
            <p className="text-center text-gray-400">Your cart is empty.</p>
          ) : (
            cart.items.map((item, index) => {
              const product = products.find(
                (prod) => prod._id === item.productId
              );
              if (!product) return null;

              return (
                <div
                  key={index}
                  className="relative flex flex-col sm:flex-row bg-white rounded-2xl p-5 gap-5 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="relative w-28 h-28 shrink-0">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}images/product/${product.thumbnail}`}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-800">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-gray-400 line-through text-sm">
                          ${product.originalPrice}
                        </p>
                        <p className="text-red-500 font-bold text-lg">
                          ${(product.finalPrice) * (item.qty)}
                        </p>
                        <p className="text-green-600 font-semibold text-sm">
                          ({product.discountPercentage}% OFF)
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="w-8 h-8 border rounded hover:bg-gray-100 font-semibold text-lg"
                        onClick={() =>
                          handleQtyChange(
                            item.productId,
                            "dec",
                            product.finalPrice,
                            product.originalPrice
                          )
                        }
                      >
                        −
                      </button>
                      <span className="px-2 font-medium">{item.qty}</span>
                      <button
                        className="w-8 h-8 border rounded hover:bg-gray-100 font-semibold text-lg"
                        onClick={() =>
                          handleQtyChange(
                            item.productId,
                            "inc",
                            product.finalPrice,
                            product.originalPrice
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Tags and Availability */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                        FREE SHIPPING
                      </span>
                      <div className="text-sm text-green-600 flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full inline-block ${product.stock ? "bg-green-600" : "bg-red-600"
                            }`}
                        />
                        {product.stock ? "In stock" : "Out of stock"}
                      </div>
                      <button
                        onClick={() => removehandler(item)}
                        className="bg-red-300 px-2 rounded cursor-pointer"
                      >
                        remove
                      </button>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="w-5 flex h-5 rounded-full border-2 border-white bg-gray-200 shadow-sm hover:ring-2 hover:ring-gray-300 cursor-pointer"></span>
                    <span className="w-5 h-5 rounded-full border-2 border-white bg-red-300 shadow-sm hover:ring-2 hover:ring-red-400 cursor-pointer"></span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="p-4 border-t space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Original Total</span>
              <span className="font-semibold">₹{cart?.final_total}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Final Total</span>
              <span className="line-through">₹{cart?.original_total}</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>You Save</span>
              <span>
                -₹{(cart?.original_total - cart?.final_total).toFixed(2)}
              </span>
            </div>
            <button
              onClick={checkoutHandler}
              className="bg-blue-600 w-full py-2 text-white rounded-md hover:bg-blue-700 mt-3 text-sm font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
