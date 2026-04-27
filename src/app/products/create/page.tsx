"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CONDITION_OPTIONS = ["Grade S", "Grade A", "Grade B", "Grade C"];

export default function CreateProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    price: "",
    condition: "Grade B",
    stock: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Check auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/profile");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "seller") {
      alert("Only seller can access this page");
      router.push("/profile");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // ✅ Parse numbers once
      const priceNum = Number(form.price);
      const stockNum = Number(form.stock);

      // ✅ Validate required fields
      if (!form.name.trim()) {
        alert("Product name is required");
        return;
      }
      if (!form.price || isNaN(priceNum) || priceNum <= 0) {
        alert("Valid price is required");
        return;
      }
      if (!form.stock || isNaN(stockNum) || stockNum < 0) {
        alert("Valid stock is required");
        return;
      }

      setLoading(true);

      // ✅ GET USER FROM LOCALSTORAGE
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("You must be logged in");
        return;
      }
      const user = JSON.parse(storedUser);

      // 🔥 1. Upload image to Cloudinary
      let imageUrl = "";

      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "jinki-upload");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dhqk7li8v/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          alert("Image upload failed");
          return;
        }

        imageUrl = uploadData.secure_url;
      }

      // 🔥 2. SAVE PRODUCT
      const token = localStorage.getItem("token");

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          price: priceNum,
          condition: form.condition,
          stock: stockNum,
          image: imageUrl || null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to create product");
        return;
      }

      alert("✅ Product created!");
      router.push("/products");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-black max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />
      <input
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />
      <select
        name="condition"
        value={form.condition}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        {CONDITION_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <input
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Create Product"}
      </button>
    </div>
  );
}