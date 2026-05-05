"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] =
    useState(true);
  const [userId, setUserId] =
    useState<string>("");

  // FETCH CART
  const fetchCart = async (uid: string) => {
    const res = await fetch(
      `/api/cart?userId=${uid}`
    );
    const data = await res.json();
    setCart(data.items || []);
  };


  // AUTH + LOAD CART
  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user?.id) {
      router.push("/login");
      return;
    }

    setUserId(user.id);
    fetchCart(user.id);
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">
          Checking authentication...
        </p>
      </div>
    );
  }

  // UPDATE QUANTITY
  const updateQuantity = async (
    productId: string,
    newQty: number
  ) => {
    if (newQty < 1) return;

    await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
        quantity: newQty,
      }),
    });

    fetchCart(userId);
  };


  // REMOVE ITEM
  const removeFromCart = async (
    productId: string
  ) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
      }),
    });

    fetchCart(userId);
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  
  // EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🛒</div>

          <h1 className="text-3xl font-bold mb-3 text-black">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mb-8">
            Looks like you haven’t added
            anything yet.
          </p>

          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // GROUP BY SELLER
  const cartBySeller = cart.reduce(
    (acc: any, item) => {
      const sellerName =
        item.sellerName ||
        "Unknown Seller";

      if (!acc[sellerName]) {
        acc[sellerName] = [];
      }

      acc[sellerName].push(item);

      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDE */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-black">
              Shopping Cart
            </h1>

            <p className="text-gray-500">
              {cart.length} item
              {cart.length > 1 && "s"}
            </p>
          </div>

          {Object.entries(cartBySeller).map(
            ([sellerName, items]: [
              string,
              any
            ]) => (
              <div
                key={sellerName}
                className="bg-white rounded-2xl shadow-sm border mb-6 overflow-hidden"
              >
                {/* STORE HEADER */}
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h2 className="font-semibold text-lg text-black">
                    {sellerName}
                  </h2>
                </div>

                {/* ITEMS */}
                <div className="divide-y">
                  {items.map((item: any) => (
                    <div
                      key={item.productId}
                      className="p-6 flex flex-col md:flex-row gap-5"
                    >
                      {/* IMAGE */}
                      <div className="w-full md:w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-black mb-1">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500 mb-2">
                          {item.condition}
                        </p>

                        <p className="text-2xl font-bold text-black">
                          $
                          {item.price.toFixed(
                            2
                          )}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-col justify-between items-end">
                        
                        {/* REMOVE */}
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.productId
                            )
                          }
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          ✕
                        </button>

                        {/* QUANTITY */}
                        <div className="flex items-center border rounded-xl overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity -
                                  1
                              )
                            }
                            className="w-10 h-10 hover:bg-gray-100"
                          >
                            -
                          </button>

                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity +
                                  1
                              )
                            }
                            className="w-10 h-10 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        {/* TOTAL */}
                        <p className="font-bold text-lg text-black">
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div>
          <div className="bg-white border rounded-2xl shadow-sm p-6 sticky top-6">
            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 border-b pb-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-5">
              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-3xl font-bold">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
              onClick={() =>
                router.push("/checkout")
              }
            >
              Proceed to Checkout
            </button>

            <Link
              href="/products"
              className="block text-center mt-4 text-sm text-gray-500 hover:text-black transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}