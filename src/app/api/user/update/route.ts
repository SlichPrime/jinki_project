import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, name, address, storeName, storeLocation } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    // Build update object dynamically
    const updateData: any = { name };
    
    // Add store fields for sellers
    if (storeName !== undefined) {
      updateData.storeName = storeName;
    }
    if (storeLocation !== undefined) {
      updateData.storeLocation = storeLocation;
    }
    
    // Add address for customers
    if (address) {
      updateData.address = address;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}