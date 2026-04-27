import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/cart";
import mongoose from "mongoose";

// =======================
// GET CART
// =======================
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  let userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  // Try to find cart with the given userId first
  let cart = await Cart.findOne({ userId });

  // If not found, try with ObjectId format
  if (!cart && mongoose.Types.ObjectId.isValid(userId)) {
    cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  }

  // If still not found, create new cart
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return Response.json(cart);
}

// =======================
// ADD TO CART
// =======================
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  let { userId, product } = body;

  if (!userId || !product || !product.productId) {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  // Try to find cart with string userId first
  let cart = await Cart.findOne({ userId });

  // If not found, try with ObjectId
  if (!cart && mongoose.Types.ObjectId.isValid(userId)) {
    cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    // If found with ObjectId, use that userId for consistency
    if (cart) {
      userId = new mongoose.Types.ObjectId(userId).toString();
    }
  }

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item: any) =>
      item.productId.toString() === product.productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    cart.items.push({
      ...product,
      quantity: product.quantity || 1,
    });
  }

  await cart.save();

  return Response.json(cart);
}

// =======================
// UPDATE QUANTITY
// =======================
export async function PUT(req: Request) {
  await connectDB();

  const body = await req.json();
  const { userId, productId, quantity } = body;

  if (!userId || !productId) {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return Response.json({ error: "Cart not found" }, { status: 404 });
  }

  const item = cart.items.find(
    (item: any) => item.productId.toString() === productId.toString()
  );

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  if (quantity <= 0) {
    // remove item if quantity <= 0
    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId.toString()
    );
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  return Response.json(cart);
}

// =======================
// DELETE ITEM / CLEAR CART
// =======================
export async function DELETE(req: Request) {
  await connectDB();

  const body = await req.json();
  const { userId, productId, clearAll } = body;

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return Response.json({ error: "Cart not found" }, { status: 404 });
  }

  if (clearAll) {
    cart.items = [];
  } else if (productId) {
    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId.toString()
    );
  } else {
    return Response.json({ error: "Missing productId" }, { status: 400 });
  }

  await cart.save();

  return Response.json(cart);
}