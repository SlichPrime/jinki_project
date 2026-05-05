"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";

export default function RegisterPage() {
  const { handleRegister } = useAuth();

  const [step, setStep] = useState<"choose" | "form">("choose");

  const [form, setForm] = useState({
    name: "", 
    email: "",
    password: "",
    role: "",

    storeName: "",
    storeLocation: "",

    // address (NO full_name anymore)
    phone: "",
    city: "",
    postal_code: "",
    address_line: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const selectRole = (role: "customer" | "seller") => {
    setForm({ ...form, role });
    setStep("form");
  };

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      alert("Please fill email & password");
      return;
    }

    if (form.role === "seller") {
      // Seller: require storeName and storeLocation only
      if (!form.storeName || !form.storeLocation) {
        alert("Seller must fill store details");
        return;
      }
    } else {
      // Customer: require address fields
      if (
        !form.phone ||
        !form.city ||
        !form.postal_code ||
        !form.address_line
      ) {
        alert("Please complete address");
        return;
      }
    }

    handleRegister(form);
  };

  // ======================
  // STEP 1: CHOOSE ROLE
  // ======================
  if (step === "choose") {
    return (
      <div className="p-6 text-black max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Choose Account Type
        </h1>

        <button
          onClick={() => selectRole("customer")}
          className="w-full bg-black text-white py-3 rounded mb-4"
        >
          Register as Customer
        </button>

        <button
          onClick={() => selectRole("seller")}
          className="w-full bg-gray-800 text-white py-3 rounded"
        >
          Register as Seller
        </button>
      </div>
    );
  }

  // ======================
  // STEP 2: FORM
  // ======================
  return (
    <div className="p-6 text-black max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {form.role} Register
      </h1>
      <input
  type="text"
  name="name"
  placeholder="Username"
  onChange={handleChange}
  className="w-full border p-2 mb-3 rounded"
/>

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />

      {form.role === "seller" && (
        <div className="mt-4 rounded-lg border bg-white p-4 text-slate-800">
          <h2 className="font-bold mb-3">Store Information</h2>

          <input
            name="storeName"
            placeholder="Store Name"
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            name="storeLocation"
            placeholder="Store Address"
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
        </div>
      )}

      {/* CUSTOMER ONLY - Address Form */}
      {form.role === "customer" && (
        <div className="mt-4 rounded-lg border bg-white p-4 text-slate-800">
          <h2 className="font-bold mb-3">Address</h2>

          <div className="grid grid-cols-2 gap-4">

            <input
              name="phone"
              onChange={handleChange}
              placeholder="Phone"
              className="rounded border p-2"
            />

            <input
              name="city"
              onChange={handleChange}
              placeholder="City"
              className="rounded border p-2"
            />

            <input
              name="postal_code"
              onChange={handleChange}
              placeholder="Postal Code"
              className="rounded border p-2"
            />

            <input
              name="address_line"
              onChange={handleChange}
              placeholder="Full Address"
              className="col-span-2 rounded border p-2"
            />

          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded mt-4"
      >
        Register
      </button>
    </div>
  );
}