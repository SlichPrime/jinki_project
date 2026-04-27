import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/cart";
import Order from "@/models/order";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await connectDB();

  const { userId } = await req.json();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Response.json({ error: "Invalid userId" }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    return Response.json({ error: "Cart empty" }, { status: 400 });
  }

  // 🔥 GROUP ITEMS BY SELLER
  const grouped: Record<string, any[]> = {};

  for (const item of cart.items) {
    const sellerId = item.sellerId?.toString();

    if (!mongoose.Types.ObjectId.isValid(sellerId)) continue;

    if (!grouped[sellerId]) {
      grouped[sellerId] = [];
    }

    grouped[sellerId].push(item);
  }

  const createdOrders = [];

  // 🔥 CREATE ONE ORDER PER SELLER
  for (const sellerId in grouped) {
    const items = grouped[sellerId];

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(userId),     // ✅ FIX
      sellerId: new mongoose.Types.ObjectId(sellerId), // ✅ FIX
      items,
      totalPrice,
      status: "pending",
    });

    createdOrders.push(order);
  }

  // 🔥 CLEAR CART
  cart.items = [];
  await cart.save();

  return Response.json(createdOrders);
}