"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "products">("users");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      
      if (parsed.role === "admin") {
        fetchData();
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      setUsers(usersData);

      const productsRes = await fetch("/api/products");
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        alert("User deleted!");
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productId));
        alert("Product deleted!");
      }
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">This page is for admins only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-2 rounded ${
            activeTab === "users" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-2 rounded ${
            activeTab === "products" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Products ({products.length})
        </button>
      </div>

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-3">{u.name || "N/A"}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      u.role === "admin" ? "bg-purple-100 text-purple-800" :
                      u.role === "seller" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.storeName || "N/A"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Table */}
      {activeTab === "products" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Grade</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">${p.price}</td>
                  <td className="px-4 py-3">{p.condition}</td>
                  <td className="px-4 py-3">{p.stock || 0}</td>
                  <td className="px-4 py-3">
                    {p.sellerId?.storeName || p.sellerId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}