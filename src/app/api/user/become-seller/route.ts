import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getUserFromRequest } from "@/lib/middleware";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    // ✅ MUST await
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ UPDATE ROLE (NOT isSeller)
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { role: "seller" },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "You are now a seller",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Become seller error:", error);

    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}