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

  /* LOAD USER */
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      setUser(parsed);

      setForm({
        name: parsed.name || "",
        phone:
          parsed.address?.phone || "",
        city:
          parsed.address?.city || "",
        postal_code:
          parsed.address?.postal_code ||
          "",
        address_line:
          parsed.address?.address_line ||
          "",
        storeName:
          parsed.storeName || "",
        storeLocation:
          parsed.storeLocation || "",
      });
    }
  }, []);

  /* INPUT */
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* SAVE */
  const handleSave = async () => {
    try {
      const isSeller =
        user.role === "seller";

      const updateData: any = {
        userId: user.id || user._id,
        name: form.name,
      };

      if (isSeller) {
        updateData.storeName =
          form.storeName;

        updateData.storeLocation =
          form.storeLocation;
      } else {
        updateData.address = {
          phone: form.phone,
          city: form.city,
          postal_code:
            form.postal_code,
          address_line:
            form.address_line,
        };
      }

      const res = await fetch(
        "/api/user/update",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            updateData
          ),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(
          result.message ||
            "Update failed"
        );
        return;
      }

      setUser(result.user);

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      alert("Profile updated!");

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  /* LOGGED IN */
  if (user) {
    const isSeller =
      user.role === "seller";

    return (
      <main className="min-h-screen bg-gray-50 text-black">

        {/* HEADER */}
        <section className="bg-black text-white py-14 px-6">
          <div className="max-w-6xl mx-auto">

            <p className="uppercase tracking-widest text-gray-400 text-sm mb-3">
              Account
            </p>

            <h1 className="text-5xl font-bold">
              My Profile
            </h1>

            <p className="text-gray-300 mt-4 text-lg">
              Manage your account
              information and preferences.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold mb-5">
                  {user.name?.charAt(0) ||
                    "U"}
                </div>

                <h2 className="text-2xl font-bold">
                  {user.name ||
                    "Unnamed User"}
                </h2>

                <p className="text-gray-500 mt-1">
                  {user.email}
                </p>

                <div className="mt-5">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 capitalize">
                    {user.role}
                  </span>
                </div>

     
                <button
                  onClick={() => {
                    localStorage.removeItem(
                      "user"
                    );

                    window.location.reload();
                  }}
                  className="w-full mt-8 bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-xl"
                >
                  Logout
                </button>
              </div>
            </div>

    
            <div className="lg:col-span-2 space-y-8">

              {!editing ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      Profile Information
                    </h2>

                    <button
                      onClick={() =>
                        setEditing(true)
                      }
                      className="px-5 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="space-y-6">

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Full Name
                      </p>

                      <p className="font-medium text-lg">
                        {user.name ||
                          "No Name"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Email Address
                      </p>

                      <p className="font-medium text-lg">
                        {user.email}
                      </p>
                    </div>

                    {isSeller && (
                      <>
                        <div className="pt-6 border-t">

                          <h3 className="text-xl font-semibold mb-4">
                            Store Information
                          </h3>

                          <div className="space-y-5">

                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Store Name
                              </p>

                              <p className="font-medium">
                                {user.storeName ||
                                  "Not set"}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Store Address
                              </p>

                              <p className="font-medium">
                                {user.storeLocation ||
                                  "Not set"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {!isSeller &&
                      user.address && (
                        <div className="pt-6 border-t">

                          <h3 className="text-xl font-semibold mb-4">
                            Shipping Address
                          </h3>

                          <div className="space-y-4">

                            <p>
                              {
                                user.address
                                  ?.phone
                              }
                            </p>

                            <p>
                              {
                                user.address
                                  ?.address_line
                              }
                            </p>

                            <p>
                              {
                                user.address
                                  ?.city
                              }
                              ,{" "}
                              {
                                user.address
                                  ?.postal_code
                              }
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      Edit Profile
                    </h2>
                  </div>

                  <div className="space-y-4">

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3"
                    />

                    {isSeller ? (
                      <>
                        <input
                          name="storeName"
                          value={
                            form.storeName
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Store Name"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        <input
                          name="storeLocation"
                          value={
                            form.storeLocation
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Store Address"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />
                      </>
                    ) : (
                      <>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={
                            handleChange
                          }
                          placeholder="Phone"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        <input
                          name="city"
                          value={form.city}
                          onChange={
                            handleChange
                          }
                          placeholder="City"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        <input
                          name="postal_code"
                          value={
                            form.postal_code
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Postal Code"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        <input
                          name="address_line"
                          value={
                            form.address_line
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Address"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />
                      </>
                    )}

                    <div className="flex gap-3 pt-4">

                      <button
                        onClick={
                          handleSave
                        }
                        className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
                      >
                        Save Changes
                      </button>

                      <button
                        onClick={() =>
                          setEditing(false)
                        }
                        className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              
              {isSeller && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                  <div className="flex items-center justify-between mb-6">

                    <div>
                      <h2 className="text-2xl font-bold">
                        My Shop
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Manage your
                        marketplace products
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        (window.location.href =
                          "/products/create")
                      }
                      className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                      Add Product
                    </button>
                  </div>

                  <SellerProducts
                    userId={
                      user._id ||
                      user.id
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to access your profile
        </p>

        {!showLogin ? (
          <button
            onClick={() =>
              setShowLogin(true)
            }
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Login
          </button>
        ) : (
          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  email:
                    e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  password:
                    e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />

            <button
              onClick={() =>
                handleLogin(loginForm)
              }
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-500">

              Don’t have an account?{" "}

              <span
                onClick={() =>
                  (window.location.href =
                    "/register")
                }
                className="text-black font-medium cursor-pointer hover:underline"
              >
                Register here
              </span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}