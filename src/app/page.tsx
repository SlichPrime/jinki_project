"use client";

import useProducts from "@/hooks/useProducts";
import ProductList from "@/component/product/productList";
import Link from "next/link";

export default function HomePage() {
  const products = useProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Jinki</h1>
          <p className="text-xl mb-8 text-gray-300">
            Discover factory-rejected items with hidden value
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-white text-black rounded font-semibold hover:bg-gray-200"
            >
              Shop Now
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 border border-white rounded font-semibold hover:bg-white hover:text-black"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="p-10">
        <h2 className="text-2xl font-semibold mb-5">Latest Finds</h2>

        {products.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No products available yet.</p>
        ) : (
          <ProductList products={products} />
        )}
      </section>
    </main>
  );
}