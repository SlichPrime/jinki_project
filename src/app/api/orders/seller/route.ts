import { connectDB } from "@/lib/mongodb";
import Order from "@/models/order";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("sellerId");

  if (!mongoose.Types.ObjectId.isValid(sellerId || "")) {
    return Response.json([], { status: 200 });
  }

  const orders = await Order.find({
    sellerId: new mongoose.Types.ObjectId(sellerId),
  }).sort({ createdAt: -1 });

  return Response.json(orders);
}

export async function PUT(req: Request) {
  await connectDB();

  const { orderId, status } = await req.json();

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  return Response.json(updated);
}