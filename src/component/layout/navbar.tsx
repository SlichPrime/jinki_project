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

  /* CLOSE DROPDOWN */
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "click",
        handleClickOutside
      );
  }, []);

  /* SEARCH SUGGESTIONS */
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
          p.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

        setSuggestions(filtered.slice(0, 5));
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const delayDebounce = setTimeout(
      fetchSuggestions,
      300
    );

    return () =>
      clearTimeout(delayDebounce);
  }, [searchQuery]);

  /* USER + CART */
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCartCount(cart.length);
  }, []);

  /* SEARCH */
  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );

      setShowDropdown(false);
    }
  };

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-black text-white border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">

        {/* LEFT - LOGO */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Jinki
          </Link>
        </div>

        {/* CENTER - SEARCH */}
        <div className="flex-1 px-8 relative">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              onFocus={() =>
                setShowDropdown(true)
              }
              className="w-full px-5 py-3 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-gray-400"
            />
          </form>

          {/* DROPDOWN */}
          {showDropdown && (
            <div className="absolute top-full left-8 right-8 mt-2 bg-white text-black rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">

              {suggestions.length > 0 ? (
                suggestions.map((item: any) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      router.push(
                        `/products?search=${encodeURIComponent(
                          item.name
                        )}`
                      );

                      setShowDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b last:border-b-0"
                  >
                    {item.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">
                  Product doesn’t exist
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT - NAVIGATION */}
        <div className="flex items-center gap-5 whitespace-nowrap text-sm">

          {/* PUBLIC NAV */}
          <Link
            href="/products"
            className="hover:text-gray-300 transition"
          >
            Products
          </Link>

          {!user ? (
            <>
              {/* GUEST */}
              <Link
                href="/login"
                className="hover:text-gray-300 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "customer" && (
                <>
                  <Link
                    href="/cart"
                    className="relative hover:text-gray-300 transition"
                  >
                    Cart

                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/orders"
                    className="hover:text-gray-300 transition"
                  >
                    Orders
                  </Link>
                </>
              )}

              {user.role === "seller" && (
                <Link
                  href="/seller/orders"
                  className="hover:text-gray-300 transition"
                >
                  Seller Orders
                </Link>
              )}

              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="hover:text-gray-300 transition"
                >
                  Admin
                </Link>
              )}

              <Link
                href="/profile"
                className="px-4 py-2 border border-white/20 rounded-xl hover:bg-white hover:text-black transition"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}