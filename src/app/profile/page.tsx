"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import SellerProducts from "@/component/product/sellerProducts";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const { handleLogin } = useAuth();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    postal_code: "",
    address_line: "",
    storeName: "",
    storeLocation: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // ======================
  // LOAD USER
  // ======================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      setForm({
        name: parsed.name || "",
        phone: parsed.address?.phone || "",
        city: parsed.address?.city || "",
        postal_code: parsed.address?.postal_code || "",
        address_line: parsed.address?.address_line || "",
        storeName: parsed.storeName || "",
        storeLocation: parsed.storeLocation || "",
      });
    }
  }, []);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // SAVE PROFILE (NAME + ADDRESS / STORE INFO)
  // ======================
  const handleSave = async () => {
    try {
      const isSeller = user.role === "seller";
      
      const updateData: any = {
        userId: user.id || user.id,
        name: form.name,
      };

      if (isSeller) {
        // Seller: update store info
        updateData.storeName = form.storeName || user.storeName;
        updateData.storeLocation = form.storeLocation || user.storeLocation;
      } else {
        // Customer: update address
        updateData.address = {
          phone: form.phone,
          city: form.city,
          postal_code: form.postal_code,
          address_line: form.address_line,
        };
      }

      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Update failed");
        return;
      }

      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));

      alert("✅ Profile updated!");
      setEditing(false);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // ======================
  // LOGGED IN VIEW
  // ======================
  if (user) {
    const isSeller = user.role === "seller";

    return (
      <div className="p-6 text-black max-w-md mx-auto">

        <h1 className="text-2xl font-bold mb-4">My Profile</h1>

        {/* VIEW MODE */}
        {!editing && (
          <div className="border p-4 rounded bg-white">

            <p><strong>Name:</strong> {user.name || "No Name"}</p>
            <p><strong>Email:</strong> {user.email}</p>

            {/* SELLER: Show store info */}
            {isSeller && (
              <div className="mt-4 pt-4 border-t">
                <p><strong>Store Name:</strong> {user.storeName || "Not set"}</p>
                <p><strong>Store Address:</strong> {user.storeLocation || "Not set"}</p>
              </div>
            )}

            {/* CUSTOMER: Show address */}
            {!isSeller && user.address && (
              <div className="mt-4 text-sm pt-4 border-t">
                <p>{user.address?.phone}</p>
                <p>{user.address?.address_line}</p>
                <p>{user.address?.city}, {user.address?.postal_code}</p>
              </div>
            )}

            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* EDIT MODE */}
        {editing && (
          <div className="border p-4 rounded bg-white">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 mb-2 w-full"
            />

            {/* SELLER: Edit store info */}
            {isSeller && (
              <>
                <input
                  name="storeName"
                  value={user.storeName || ""}
                  onChange={(e: any) => setForm({ ...form, storeName: e.target.value })}
                  placeholder="Store Name"
                  className="border p-2 mb-2 w-full"
                />
                <input
                  name="storeLocation"
                  value={user.storeLocation || ""}
                  onChange={(e: any) => setForm({ ...form, storeLocation: e.target.value })}
                  placeholder="Store Address"
                  className="border p-2 mb-2 w-full"
                />
              </>
            )}

            {/* CUSTOMER: Edit address */}
            {!isSeller && (
              <>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border p-2 mb-2 w-full"
                />

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border p-2 mb-2 w-full"
                />

                <input
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="border p-2 mb-2 w-full"
                />

                <input
                  name="address_line"
                  value={form.address_line}
                  onChange={handleChange}
                  placeholder="Address"
                  className="border p-2 mb-2 w-full"
                />
              </>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>

        {/* SELLER SHOP SECTION */}
        <div className="mb-6 border p-4 rounded bg-white mt-6">
          <h2 className="text-lg font-semibold mb-2">My Shop</h2>

          <p className="text-sm mb-3">
            Store: {user.storeName || "No Store Name"}
          </p>

     {user.role === "seller" && (
  <button
    onClick={() => (window.location.href = "/products/create")}
    className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
  >
    Add Product
  </button>
)}
        </div>

        <SellerProducts userId={user._id || user.id} />
      </div>
    );
  }

  // ======================
  // NOT LOGGED IN
  // ======================
  return (
    <div className="p-6 text-black max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="border p-4 rounded mb-6 bg-white text-center">
        <p>You are not logged in</p>
      </div>

      {!showLogin && (
        <button
          onClick={() => setShowLogin(true)}
          className="w-full bg-black text-white py-2 rounded"
        >
          Login
        </button>
      )}

      {showLogin && (
        <div className="mt-4">

          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            className="w-full border p-2 mb-2"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="w-full border p-2 mb-2"
          />

          <button
            onClick={() => handleLogin(loginForm)}
            className="w-full bg-black text-white py-2 rounded"
          >
            Login
          </button>

          <p className="text-sm text-center mt-2">
            Don’t have an account?{" "}
            <span
              onClick={() => (window.location.href = "/register")}
              className="text-blue-500 cursor-pointer underline"
            >
              Register here
            </span>
          </p>

        </div>
      )}
    </div>
  );
}