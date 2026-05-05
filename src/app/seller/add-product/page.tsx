"use client";

import { useState } from "react";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    condition: "",
    stock: "",
    description: "",
    image: "",
  });

  const [file, setFile] = useState<any>(null);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // UPLOAD IMAGE (Cloudinary)
  const uploadImage = async () => {
    if (!file) return null;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_upload_preset"); // ⚠️ change this

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

  // SUBMIT PRODUCT
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      let imageUrl = "";
      if (file) {
        imageUrl = await uploadImage(); // upload first
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          image: imageUrl,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed");
        return;
      }

      alert("Product created!");
      window.location.href = "/products";

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-6 text-black max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>

      <input name="name" placeholder="Product Name" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="price" placeholder="Price" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="condition" placeholder="Condition" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="stock" placeholder="Stock" onChange={handleChange} className="border p-2 mb-2 w-full" />

      <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-2 mb-2 w-full" />

      {/* IMAGE */}
      <input
        type="file"
        onChange={(e: any) => setFile(e.target.files[0])}
        className="mb-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Add Product
      </button>
    </div>
  );
}