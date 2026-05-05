import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/order";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    // 1. Ensure DB connection
    await connectDB();

    // 2. Get query param
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("API - Received userId:", userId);

    // 3. Validate userId format
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    // 4. Fetch orders (IMPORTANT FIX HERE)
const orders = await Order.find({
  userId: new mongoose.Types.ObjectId(userId),
  isClosed: false,
});

    console.log("API - Orders found:", orders.length);

    // 5. Return data
   return NextResponse.json({ success: true, orders });

  } catch (err) {
    console.error("API - Error fetching orders:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "Missing orderId" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid orderId" },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(orderId);

    return NextResponse.json({
      message: "Order removed successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to remove order" },
      { status: 500 }
    );
  }
}