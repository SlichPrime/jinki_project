import { connectDB } from "@/lib/mongodb";
import Order from "@/models/order";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!mongoose.Types.ObjectId.isValid(userId || "")) {
    return Response.json([], { status: 200 });
  }

  const orders = await Order.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ createdAt: -1 });

  return Response.json(orders);
}