import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      name,
      email,
      password,
      role,
      storeName,
      storeLocation,
      phone,
      city,
      postal_code,
      address_line,
    } = await req.json();

  
    if (!name) {
  return NextResponse.json(
    { message: "Username is required" },
    { status: 400 }
  );
}
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (role === "seller" && (!storeName || !storeLocation)) {
      return NextResponse.json(
        { message: "Seller must provide store info" },
        { status: 400 }
      );
    }

    if (!phone || !city || !postal_code || !address_line) {
      return NextResponse.json(
        { message: "Address is required" },
        { status: 400 }
      );
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    //HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER WITH FULL ADDRESS OBJECT
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",

      storeName: role === "seller" ? storeName : null,
      storeLocation: role === "seller" ? storeLocation : null,

      address: {
        phone,
        city,
        postal_code,
        address_line,
      },
    });

    return NextResponse.json({
      message: "Register success",
      user: newUser,
    });

  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}