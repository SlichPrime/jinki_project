import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // 🔍 FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please register first." },
        { status: 400 }
      );
    }

    // 🔐 CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // 🔑 CREATE TOKEN
const token = signToken({
  id: user._id,
  role: user.role,
});

    // ✅ CLEAN USER OBJECT (IMPORTANT)
    const cleanUser = {
      id: user._id,
      name: user.name || "",
      email: user.email,
      role: user.role,
      address: user.address || null,
      storeName: user.storeName || null,
      storeLocation: user.storeLocation || null,
    };

    // ✅ RESPONSE
    return NextResponse.json({
      message: "Login success",
      token,
      user: cleanUser,
    });

  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}