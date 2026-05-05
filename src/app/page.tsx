"use client";

import { useEffect, useState } from "react";
import useProducts from "@/hooks/useProducts";
import ProductList from "@/component/product/productList";
import Link from "next/link";

export default function HomePage() {
  const products = useProducts();

  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.role === "seller") {
      setIsSeller(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div>
            {isSeller ? (
              <>
                <p className="uppercase tracking-widest text-gray-400 text-sm mb-3">
                  Seller Dashboard
                </p>

                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Welcome Seller!
                </h1>

                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  Manage your products, track orders, and grow your store on Jinki.
                </p>

                <Link
                  href="/profile"
                  className="inline-block px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Manage Store
                </Link>
              </>
            ) : (
              <>
                <p className="uppercase tracking-widest text-gray-400 text-sm mb-3">
                  Sustainable Marketplace
                </p>

                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Hidden Value.
                  <br />
                  Smart Shopping.
                </h1>

                <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
                  Discover quality factory-rejected products at affordable prices
                  while reducing waste through smarter consumption.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Explore Products
                  </Link>

                  <Link
                    href="/register"
                    className="px-8 py-4 border border-white rounded-xl font-semibold hover:bg-white hover:text-black transition"
                  >
                    Become a Seller
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-md">

              <div className="space-y-4">

                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Sustainable Shopping
                  </h3>

                  <p className="text-gray-300 text-sm">
                    Reduce industrial waste by giving products a second chance.
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Affordable Prices
                  </h3>

                  <p className="text-gray-300 text-sm">
                    Save money on quality products with minor imperfections.
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Trusted Sellers
                  </h3>

                  <p className="text-gray-300 text-sm">
                    Connect directly with verified stores across Indonesia.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
        

      {/* PRODUCT SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-200">
        <div className="flex items-center justify-between mb-8">

          <div>
            <p className="uppercase tracking-widest text-sm text-gray-500 mb-2">
      
            </p>

            <h2 className="text-4xl font-bold">
              Latest Finds
            </h2>
          </div>

          <Link
            href="/products"
            className="text-sm font-medium hover:underline"
          >
            View All Products
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center text-gray-500">
            No products available yet.
          </div>
        ) : (
          <ProductList products={products.slice(0, 8)} />
        )}
      </section>
    </main>
  );
}