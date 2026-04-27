"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any>({});
  const [userId, setUserId] = useState("");

  // =========================
  // FETCH CART
  // =========================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id) {
      router.push("/login");
      return;
    }

    setUserId(user.id);

    const fetchCart = async () => {
      const res = await fetch(`/api/cart?userId=${user.id}`);
      const data = await res.json();

      setCart(data.items || []);
    };

    fetchCart();
  }, [router]);

  // =========================
  // GROUP BY SELLER
  // =========================
  useEffect(() => {
    const groupedData = cart.reduce((acc: any, item) => {
      const seller = item.sellerName || "Unknown";

      if (!acc[seller]) {
        acc[seller] = [];
      }

      acc[seller].push(item);
      return acc;
    }, {});

    setGrouped(groupedData);
  }, [cart]);

  // =========================
  // TOTAL
  // =========================
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // =========================
  // CONFIRM CHECKOUT
  // =========================
  const handleCheckout = async () => {
    const res = await fetch("/api/orders/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Checkout failed");
      return;
    }

    // Clear cart in localStorage and API
    localStorage.removeItem("cart");
    
    // Also clear cart in database
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, clearAll: true }),
    });

    alert("Order placed!");
    router.push("/orders");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {Object.entries(grouped).map(([seller, items]: any) => (
        <div key={seller} className="mb-6 border p-4 rounded bg-white">
          <h2 className="font-semibold mb-2">Store: {seller}</h2>

          {items.map((item: any) => (
            <div
              key={item.productId}
              className="flex justify-between py-2 border-b"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* TOTAL */}
      <div className="mt-6 border-t pt-4 flex justify-between">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* CONFIRM BUTTON */}
      <button
        onClick={handleCheckout}
        className="w-full mt-6 py-3 bg-black text-white rounded"
      >
        Confirm Checkout
      </button>
    </div>
  );
}