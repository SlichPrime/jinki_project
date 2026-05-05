"use client";

import { useEffect, useState } from "react";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { getUserFromStorage } from "@/lib/auth";

export default function SellerOrdersPage() {
  useRoleGuard("seller");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const user = getUserFromStorage();
      if (!user?._id) return;

      const res = await fetch(`/api/orders/seller?sellerId=${user._id}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId); // Set loading state for specific button
    try {
      await fetch("/api/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      // Refresh the list after update
      await fetchOrders();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="p-6">Loading seller orders...</p>;
  if (orders.length === 0) return <p className="p-6">No seller orders found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Seller Orders</h1>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order._id} className="border border-brown-300 p-4 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p className="text-lg font-bold">Total: Rp{order.totalPrice.toLocaleString()}</p>
                <p className="text-sm font-medium mb-2">
                  Status: <span className="text-gold-600">{order.status}</span>
                </p>
              </div>
            </div>

            <div className="mt-2 mb-4">
              <p className="font-semibold text-sm mb-1">Items:</p>
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-600">
                  • {item.name} x {item.quantity}
                </div>
              ))}
            </div>

            {/* STATUS BUTTONS */}
            <div className="flex gap-2">
              {["processing", "shipped", "finished", "canceled"].map((status) => (
                <button
                  key={status}
                  disabled={updatingId === order._id}
                  onClick={() => updateStatus(order._id, status)}
                  className={`px-3 py-1 rounded text-white text-xs uppercase font-bold 
                    ${updatingId === order._id ? "opacity-50 cursor-not-allowed" : ""}
                    ${status === "processing" ? "bg-yellow-600" : ""}
                    ${status === "shipped" ? "bg-blue-600" : ""}
                    ${status === "finished" ? "bg-green-700" : ""}
                    ${status === "canceled" ? "bg-red-700" : ""}
                  `}
                >
                  {updatingId === order._id ? "Updating..." : status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}