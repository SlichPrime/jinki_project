import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const { userId, address } = await req.json();

    // VALIDATION
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { message: "Address is required" },
        { status: 400 }
      );
    }

    const { phone, city, postal_code, address_line } = address;

    if (!phone || !city || !postal_code || !address_line) {
      return NextResponse.json(
        { message: "All address fields are required" },
        { status: 400 }
      );
    }

    // CHECK USER EXISTS
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    //UPDATE ADDRESS (force object format)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        address: {
          phone,
          city,
          postal_code,
          address_line,
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}