"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/component/product/productList";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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

  // Apply search from URL params
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setFilters((prev) => ({ ...prev, search }));
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
  (p: any) =>
    p.name?.toLowerCase().includes(searchLower)
);
    }

    // Grade filter
    if (filters.grade) {
      result = result.filter((p: any) => p.condition === filters.grade);
    }

    // Sort
    switch (filters.sortBy) {
      case "price-high":
        result.sort((a: any, b: any) => b.price - a.price);
        break;
      case "price-low":
        result.sort((a: any, b: any) => a.price - b.price);
        break;
      case "name-asc":
        result.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        result.sort((a: any, b: any) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "newest":
      default:
        result.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">Products</h1>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        {/* <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 border rounded text-black"
          />
        </div> */}

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4">
          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="px-4 py-2 border rounded text-black"
          >
            <option value="newest">Newest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>

          {/* Grade Filter */}
          <select
            value={filters.grade}
            onChange={(e) => handleFilterChange("grade", e.target.value)}
            className="px-4 py-2 border rounded text-black"
          >
            <option value="">All Grades</option>
            <option value="Grade S">Grade S</option>
            <option value="Grade A">Grade A</option>
            <option value="Grade B">Grade B</option>
            <option value="Grade C">Grade C</option>
          </select>

          {/* Clear Filters */}
          {(filters.search || filters.grade) && (
            <button
              onClick={() => setFilters({ search: "", sortBy: "newest", grade: "" })}
              className="px-4 py-2 text-red-600 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-500 mb-4">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found</p>
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </div>
  );
}