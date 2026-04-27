import Link from "next/link";

export default function ProductCard({ product }: any) {
  // Get seller info from populated field
  const seller = product.sellerId;
  const storeName = seller?.storeName || seller?.name || "Unknown Seller";

  return (
    <Link href={`/products/${product._id}`} className="block">
      <div className="border p-4 cursor-pointer hover:shadow-lg transition-shadow rounded-lg bg-white">

        {/* ✅ FIX: safe image rendering */}
        {product.image && product.image !== "" ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover mb-2 rounded"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}

        <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
        <p className="text-blue-600 font-bold text-xl mb-1">${product.price}</p>
        <p className="text-sm text-gray-600 mb-1">{product.condition}</p>
        <p className="text-sm text-gray-500">Stock: {product.stock || 0}</p>
        
        {/* Show seller store name */}
        <div className="mt-2 pt-2 border-t text-sm text-gray-500">
          <span className="font-medium">Seller:</span> {storeName}
        </div>
      </div>
    </Link>
  );
}