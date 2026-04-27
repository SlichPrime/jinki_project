import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

// GET ALL USERS
export async function GET() {
  await connectDB();
  const users = await User.find().select("-password");
  return NextResponse.json(users);
}

// DELETE USER
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { userId } = await req.json();
    
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
  }
}