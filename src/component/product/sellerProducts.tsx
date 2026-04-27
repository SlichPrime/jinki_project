"use client";

import { useEffect, useState } from "react";
import ProductCard from "./productCard";

export default function SellerProducts({ userId }: any) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();

      // ✅ filter only seller products - handle both populated and string sellerId
      const filtered = data.filter((p: any) => {
        const productSellerId = p.sellerId?._id || p.sellerId;
        return productSellerId === userId;
      });

      setProducts(filtered);
    };

    fetchProducts();
  }, [userId]);

  if (products.length === 0) {
    return <p className="text-gray-500 mt-4">No products yet</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {products.map((p: any) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}