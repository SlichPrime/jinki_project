"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string>("");

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async (uid: string) => {
    const res = await fetch(`/api/cart?userId=${uid}`);
    const data = await res.json();
    setCart(data.items || []);
  };

  // =========================
  // AUTH + LOAD CART
  // =========================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

   if (!user?.id) {
      router.push("/login");
      return;
    }

    setUserId(user.id);
fetchCart(user.id);
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return <p className="p-6 text-black">Checking authentication...</p>;
  }

  // =========================
  // UPDATE QUANTITY (API)
  // =========================
  const updateQuantity = async (productId: string, newQty: number) => {
    await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
        quantity: newQty,
      }),
    });

    fetchCart(userId);
  };

  // =========================
  // REMOVE ITEM (API)
  // =========================
  const removeFromCart = async (productId: string) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
      }),
    });

    fetchCart(userId);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">
          Add some products to get started!
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-black text-white rounded"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // =========================
  // GROUP BY SELLER
  // =========================
  const cartBySeller = cart.reduce((acc: any, item) => {
    const sellerName = item.sellerName || "Unknown Seller";
    if (!acc[sellerName]) {
      acc[sellerName] = [];
    }
    acc[sellerName].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {Object.entries(cartBySeller).map(
        ([sellerName, items]: [string, any]) => (
          <div
            key={sellerName}
            className="mb-6 border rounded-lg p-4 bg-white"
          >
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Store: {sellerName}
            </h2>

            {items.map((item: any) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 py-4 border-b last:border-b-0"
              >
                {/* Image */}
                <div className="w-20 h-20 bg-gray-200 rounded">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Grade: {item.condition}
                  </p>
                  <p className="text-blue-600 font-bold">
                    ${item.price}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="w-8 h-8 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <div className="text-right min-w-[80px]">
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Summary */}
      <div className="mt-6 border-t pt-6">
        <div className="flex justify-between mb-4">
          <span>Subtotal:</span>
          <span className="text-2xl font-bold">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <button className="w-full py-3 bg-black text-white rounded"
        onClick={() => router.push("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}