import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/order";
import mongoose from "mongoose";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { orderId } = await req.json();

    console.log("MARK DONE:", orderId);

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { isClosed: true },
      { new: true }
    );

    console.log("UPDATED ORDER:", updated);

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
} 