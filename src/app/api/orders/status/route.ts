import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/order";
import mongoose from "mongoose";

/* UPDATE ORDER STATUS */
export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Missing orderId or status" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid orderId" },
        { status: 400 }
      );
    }

    const allowedStatus = [
      "pending",
      "processing",
      "shipped",
      "finished",
      "canceled",
    ];

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update order status" },
      { status: 500 }
    );
  }
}

/* DELETE CANCELED ORDER */
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

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

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