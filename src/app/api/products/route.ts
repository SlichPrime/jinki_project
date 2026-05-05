import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product";
import User from "@/models/user"; // Import to register schema
import { getUserFromRequest } from "@/lib/middleware";

// GET ALL PRODUCTS
export async function GET() {
  await connectDB();

  const products = await Product.find()
    .populate("sellerId", "name storeName storeLocation")
    .sort({ createdAt: -1 });
  return NextResponse.json(products);
}

// CREATE PRODUCT (SELLER ONLY)
export async function POST(req: Request) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);

  
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

  
    if ((user.role as string) !== "seller" && (user.role as string) !== "admin") {
      return NextResponse.json(
        { error: "Only seller or admin can create product" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const product = await Product.create({
      name: body.name,
      price: body.price,
      condition: body.condition,
      stock: body.stock,
      image: body.image || "",
      description: body.description || "",
      sellerId: user.id, 
    });

    return NextResponse.json({
      message: "Product created",
      product,
    });

  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}