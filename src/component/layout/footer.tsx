import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10 pb-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Jinki
            </h2>

            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              Discover hidden-value products through a smarter and more sustainable marketplace experience.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Products
                </Link>
              </li>

              <li>
                <Link href="/orders" className="hover:text-white transition">
                  Orders
                </Link>
              </li>

              <li>
                <Link href="/profile" className="hover:text-white transition">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-gray-400">
              <p>support@jinki.com</p>
              <p>Indonesia Marketplace Platform</p>

              <div className="flex gap-3 pt-2">
                <div className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer">
                  f
                </div>

                <div className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer">
                  ig
                </div>

                <div className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer">
                  𝕏
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

          <p>
            © 2026 Jinki. All rights reserved.
          </p>

          <div className="flex gap-3">
            <span className="border border-white/10 px-2 py-1 rounded text-xs">
              VISA
            </span>

            <span className="border border-white/10 px-2 py-1 rounded text-xs">
              OVO
            </span>

            <span className="border border-white/10 px-2 py-1 rounded text-xs">
              GOPAY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}