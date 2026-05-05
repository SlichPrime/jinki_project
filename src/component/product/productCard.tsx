import Link from "next/link";

export default function ProductCard({ product }: any) {
  const seller = product.sellerId;

  const storeName =
    seller?.storeName ||
    seller?.name ||
    "Unknown Seller";

  return (
    <Link
      href={`/products/${product._id}`}
      className="block group"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1 h-full flex flex-col">

        {/* PRODUCT IMAGE */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">

          {product.image && product.image !== "" ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image Available
            </div>
          )}

          {/* CONDITION BADGE */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              {product.condition || "Used"}
            </span>
          </div>
        </div>

        {/* PRODUCT CONTENT */}
        <div className="p-5 flex flex-col flex-1">

          {/* TITLE */}
          <h2 className="font-semibold text-lg leading-snug line-clamp-2 min-h-[56px]">
            {product.name}
          </h2>

          {/* SELLER */}
          <p className="text-sm text-gray-500 mt-2">
            Sold by{" "}
            <span className="font-medium text-gray-700">
              {storeName}
            </span>
          </p>

          {/* STOCK */}
          <div className="mt-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Stock: {product.stock || 0}
            </span>
          </div>

          {/* BOTTOM */}
          <div className="mt-auto pt-5 flex items-center justify-between">

            {/* PRICE */}
            <div>
              <p className="text-2xl font-bold text-black">
                ${product.price}
              </p>
            </div>

            {/* BUTTON */}
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}