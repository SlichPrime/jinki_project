"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [suggestions, setSuggestions] = useState<any[]>([]);
const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
  const handleClickOutside = () => {
    setShowDropdown(false);
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

  useEffect(() => {
  const fetchSuggestions = async () => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      const filtered = data.filter((p: any) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSuggestions(filtered.slice(0, 5)); // limit results
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const delayDebounce = setTimeout(fetchSuggestions, 300);
  return () => clearTimeout(delayDebounce);
}, [searchQuery]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Update cart count
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  return (
  <nav className="flex justify-between items-center px-6 py-4 bg-black text-white">
    {/* LEFT: Logo */}
    <Link href="/" className="text-xl font-bold">
      Jinki
    </Link>

    {/* CENTER: Search */}
    <div className="flex-1 max-w-2xl mx-4 relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="w-full px-4 py-2 rounded bg-white text-black"
        />
      </form>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute top-full left-0 w-full bg-white text-black shadow-lg rounded mt-1 z-50 border">
          {suggestions.length > 0 ? (
            suggestions.map((item: any) => (
              <div
                key={item._id}
                onClick={() => {
                  router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              Product doesn’t exist
            </div>
          )}
        </div>
      )}
    </div>

    {/* RIGHT: Navigation */}
    <div className="flex gap-4 items-center whitespace-nowrap">
      {!user ? (
        <>
          {/* GUEST VIEW */}
          <Link href="/login" className="px-4 py-2 hover:text-gray-300">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 hover:text-gray-300">
            Register
          </Link>
        </>
      ) : (
        <>
          {/* LOGGED-IN VIEW */}

          {/* Cart */}
          {user.role === "customer" && (
            <Link
              href="/cart"
              className="px-4 py-2 relative hover:text-gray-300"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Orders */}
          {user.role === "customer" && (
            <Link href="/orders" className="px-4 py-2 hover:text-gray-300">
              Orders
            </Link>
          )}

          {/* Seller Orders */}
          {user.role === "seller" && (
            <Link href="/seller/orders" className="px-4 py-2 hover:text-gray-300">
              Orders
            </Link>
          )}

          {/* Admin */}
          {user.role === "admin" && (
            <Link href="/admin" className="px-4 py-2 hover:text-gray-300">
              Admin
            </Link>
          )}

          {/* Profile */}
          <Link
            href="/profile"
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black"
          >
            Profile
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </>
      )}
    </div>
  </nav>
);
}