import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/cart";
import Order from "@/models/order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET: Retrieve orders for a specific seller
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return NextResponse.json({ error: "Invalid or missing sellerId" }, { status: 400 });
    }

    const orders = await Order.find({ sellerId: new mongoose.Types.ObjectId(sellerId) });
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST: Checkout process (Group by seller & Clear cart)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    // IMPORTANT: Make sure to .populate('items.productId') if your cart only stores product references
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Group items by Seller
    const grouped: Record<string, any[]> = {};

    cart.items.forEach((item: any) => {
      // Ensure the item has a sellerId. If not, you might need to look it up from the Product model.
      const sellerId = item.sellerId?.toString();
      if (!sellerId) return;

      if (!grouped[sellerId]) {
        grouped[sellerId] = [];
      }
      grouped[sellerId].push(item);
    });

    // 2. Create individual orders for each seller
    const createdOrders = [];

    for (const sellerId in grouped) {
      const items = grouped[sellerId];
      const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const newOrder = await Order.create({
  userId: new mongoose.Types.ObjectId(userId),
  sellerId: new mongoose.Types.ObjectId(sellerId),
  items,
  totalPrice,
  status: "pending",
  isClosed: false, 
});
      createdOrders.push(newOrder);
    }

    // 3. Clear the cart
    cart.items = [];
    await cart.save();

    return NextResponse.json({ success: true, orders: createdOrders }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}