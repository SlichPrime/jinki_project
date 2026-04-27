"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchOrders = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    if (!user?._id) return;

    const res = await fetch(`/api/orders?userId=${user._id}`);
    const data = await res.json();

    console.log(data);
  };

  fetchOrders();
}, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finished":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 🔥 LOADING STATE
  if (loading) {
    return <p className="p-6 text-black">Loading orders...</p>;
  }

  // 🔥 NOT LOGGED IN
  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <Link href="/login" className="text-blue-600 hover:underline">
          Login to view your orders
        </Link>
      </div>
    );
  }

  // 🔥 NO ORDERS
  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-6">
          Start shopping to see your orders here!
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 bg-white"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4 pb-3 border-b">
              <div>
                <p className="text-sm text-gray-500">
                  Order ID: {order._id}
                </p>
                <p className="text-sm text-gray-500">
                  Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* ITEMS */}
            <div className="space-y-3">
              {order.items?.map((item: any, idx: number) => (
                <div
                  key={`${order._id}-${idx}`}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs text-gray-400">
                      Store: {item.sellerName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <span className="text-gray-600">Total:</span>
              <span className="text-xl font-bold">
                ${order.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}