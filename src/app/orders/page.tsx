"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] =
    useState<string | null>(null);

  const fetchOrders = async (
    userId: string
  ) => {
    try {
      const res = await fetch(
        `/api/orders?userId=${userId}`
      );

      const data = await res.json();

      setOrders(data.orders || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsDone = async (
    orderId: string
  ) => {
    try {
      setIsUpdating(orderId);

      await fetch("/api/orders/done", {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      if (user?._id) {
        await fetchOrders(user._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  // REMOVE ORDER
  const removeOrder = async (
    orderId: string
  ) => {
    const confirmDelete = confirm(
      "Are you sure you want to remove this canceled order?"
    );

    if (!confirmDelete) return;

    try {
      setIsUpdating(orderId);

      const res = await fetch(
        "/api/orders/status",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.message ||
            "Failed to remove order"
        );
        return;
      }

      setOrders((prev) =>
        prev.filter(
          (order) =>
            order._id !== orderId
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser =
      JSON.parse(storedUser);

    setUser(parsedUser);

    if (parsedUser?._id) {
      fetchOrders(
        parsedUser._id
      ).finally(() =>
        setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  const getStatusColor = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "finished":
        return "bg-green-100 text-green-700 border border-green-200";

      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";

      case "canceled":
        return "bg-red-100 text-red-700 border border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading orders...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Please Login
          </h1>

          <p className="text-gray-500 mb-8">
            Login to view your
            orders and purchases.
          </p>

          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">
              My Orders
            </h1>

            <p className="text-gray-500 mt-2">
              Track and manage your
              purchases
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="px-4 py-2 bg-white border rounded-xl text-sm text-gray-600">
              {orders.length} Order
              {orders.length > 1 &&
                "s"}
            </span>
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white border rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-5">
            </div>

            <h2 className="text-3xl font-bold mb-3">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mb-8">
              Start shopping to see
              your orders here.
            </p>

            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(
              (order: any) => (
                <div
                  key={order._id}
                  className="bg-white border rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* TOP */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b bg-gray-50">
                    
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-semibold text-black break-all">
                        {order._id}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium w-fit ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="divide-y">
                    {order.items?.map(
                      (
                        item: any,
                        idx: number
                      ) => (
                        <div
                          key={`${order._id}-${idx}`}
                          className="p-6 flex flex-col md:flex-row gap-5"
                        >
                          {/* IMAGE */}
                          <div className="w-full md:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* INFO */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-black">
                              {item.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              Qty:{" "}
                              {
                                item.quantity
                              }
                            </p>

                            <p className="text-sm text-gray-400 mt-1">
                              Store:{" "}
                              {item.sellerName ||
                                "N/A"}
                            </p>
                          </div>

                          {/* PRICE */}
                          <div className="text-right">
                            <p className="text-xl font-bold text-black">
                              $
                              {(
                                item.price *
                                item.quantity
                              ).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* BOTTOM */}
                  <div className="px-6 py-5 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 font-medium">
                        Total
                      </span>

                      <span className="text-3xl font-bold text-black">
                        $
                        {order.totalPrice?.toFixed(
                          2
                        ) || "0.00"}
                      </span>
                    </div>

                    {/* FINISHED */}
                    {order.status ===
                      "finished" &&
                      !order.isClosed && (
                        <button
                          onClick={() =>
                            markAsDone(
                              order._id
                            )
                          }
                          disabled={
                            isUpdating ===
                            order._id
                          }
                          className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                        >
                          {isUpdating ===
                          order._id
                            ? "Processing..."
                            : "Mark as Done"}
                        </button>
                      )}

                    {/* REMOVE */}
                    {order.status ===
                      "canceled" && (
                        <button
                          onClick={() =>
                            removeOrder(
                              order._id
                            )
                          }
                          disabled={
                            isUpdating ===
                            order._id
                          }
                          className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                        >
                          {isUpdating ===
                          order._id
                            ? "Removing..."
                            : "Remove Order"}
                        </button>
                      )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}