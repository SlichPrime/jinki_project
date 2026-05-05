"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/component/product/productList";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: "",
    sortBy: "newest",
    grade: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  /* SEARCH PARAMS */
  useEffect(() => {
    const search = searchParams.get("search");

    if (search) {
      setFilters((prev) => ({
        ...prev,
        search,
      }));
    }
  }, [searchParams]);


  useEffect(() => {
    let result = [...products];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();

      result = result.filter((p: any) =>
        p.name?.toLowerCase().includes(searchLower)
      );
    }

    /* GRADE */
    if (filters.grade) {
      result = result.filter(
        (p: any) => p.condition === filters.grade
      );
    }

    switch (filters.sortBy) {
      case "price-high":
        result.sort(
          (a: any, b: any) => b.price - a.price
        );
        break;

      case "price-low":
        result.sort(
          (a: any, b: any) => a.price - b.price
        );
        break;

      case "name-asc":
        result.sort((a: any, b: any) =>
          (a.name || "").localeCompare(
            b.name || ""
          )
        );
        break;

      case "name-desc":
        result.sort((a: any, b: any) =>
          (b.name || "").localeCompare(
            a.name || ""
          )
        );
        break;

      case "newest":
      default:
        result.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleFilterChange = (
    key: string,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <section className="bg-black text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">

          <p className="uppercase tracking-widest text-gray-400 text-sm mb-3">
            Marketplace
          </p>

          <h1 className="text-5xl font-bold mb-4">
            Explore Products
          </h1>

          <p className="text-gray-300 text-lg max-w-2xl">
            Discover curated factory-rejected products with hidden value at affordable prices.
          </p>
        </div>
      </section>

    
      <section className="max-w-7xl mx-auto px-6 py-10">

    
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange(
                    "sortBy",
                    e.target.value
                  )
                }
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white"
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="name-asc">
                  Name: A-Z
                </option>

                <option value="name-desc">
                  Name: Z-A
                </option>
              </select>
              <select
                value={filters.grade}
                onChange={(e) =>
                  handleFilterChange(
                    "grade",
                    e.target.value
                  )
                }
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white"
              >
                <option value="">
                  All Grades
                </option>

                <option value="Grade S">
                  Grade S
                </option>

                <option value="Grade A">
                  Grade A
                </option>

                <option value="Grade B">
                  Grade B
                </option>

                <option value="Grade C">
                  Grade C
                </option>
              </select>

          
              {(filters.search ||
                filters.grade) && (
                <button
                  onClick={() =>
                    setFilters({
                      search: "",
                      sortBy: "newest",
                      grade: "",
                    })
                  }
                  className="px-5 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              Available Products
            </h2>

            <p className="text-gray-500 mt-1">
              Showing {filteredProducts.length} of{" "}
              {products.length} products
            </p>
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">

            <h3 className="text-2xl font-semibold mb-3">
              No Products Found
            </h3>

            <p className="text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <ProductList products={filteredProducts} />
        )}
      </section>
    </main>
  );
}