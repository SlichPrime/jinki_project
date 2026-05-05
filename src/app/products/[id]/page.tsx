    "use client";

    import { useEffect, useState } from "react";
    import { useParams, useRouter } from "next/navigation";
import user from "@/models/user";

    export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [product, setProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
          const userData = JSON.parse(localStorage.getItem("user") || "{}");

        setIsLoggedIn(!!userData?.id);   
        setIsSeller(userData?.role === "seller");
        const fetchProduct = async () => {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        };

        if (id) fetchProduct();
    }, [id]);

const addToCart = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?.id) {
    alert("Please login first");
    router.push("/login");
    return;
  }

  const cartItem = {
    productId: product._id,
    name: product.name,
    price: product.price,
    condition: product.condition,
    image: product.image,
    quantity: quantity,
    sellerId: product.sellerId?._id?.toString() || product.sellerId?.toString() || "",
    sellerName:
      product.sellerId?.storeName ||
      product.sellerId?.name ||
      "Unknown",
  };

  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        product: cartItem,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add to cart");
      return;
    }

    alert("Added to cart!");
    router.push("/cart");
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};
    if (!product) return <p className="p-6 text-black">Loading...</p>;

    // Get seller info from populated field
    const seller = product.sellerId;
    const storeName = seller?.storeName || seller?.name || "Unknown Seller";
    const storeLocation = seller?.storeLocation || "";

    return (
        <div className="p-6 max-w-4xl mx-auto text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    {product.image && product.image !== "" ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                            <span className="text-gray-500 text-lg">No Image Available</span>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    
                    <div className="mb-4">
                        <span className="text-4xl font-bold text-blue-600">${product.price}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">Condition</span>
                            <span className="font-medium bg-gray-100 px-3 py-1 rounded">{product.condition}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">Stock</span>
                            <span className="font-medium">{product.stock || 0} units</span>
                        </div>
                        {product.description && (
                            <div className="py-2 border-b">
                                <span className="text-gray-600 block mb-2">Description</span>
                                <p className="text-gray-800">{product.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Seller Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                        <h3 className="font-semibold text-lg mb-2">Seller Information</h3>
                        <p className="text-gray-700">{storeName}</p>
                        {storeLocation && (
                            <p className="text-gray-500 text-sm mt-1">{storeLocation}</p>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="mt-6">
                        <label className="block text-sm text-gray-600 mb-2">Quantity:</label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                -
                            </button>
                            <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                                className="w-10 h-10 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
  onClick={addToCart}
  disabled={!isLoggedIn || isSeller}
  className={`w-full py-3 rounded-lg mt-6 font-medium transition-colors ${
    isLoggedIn && !isSeller
  ? "bg-blue-600 hover:bg-blue-700 text-white"
  : "bg-gray-400 cursor-not-allowed text-white"
  }`}
>
 {!isLoggedIn
  ? "Login to Add to Cart"
  : isSeller
  ? "Seller Cannot Buy Products"
  : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
</button>
                </div>
            </div>
        </div>
    );
    }