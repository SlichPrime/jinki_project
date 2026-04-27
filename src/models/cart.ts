import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  image: String,
  quantity: Number,

  sellerId: String,       
  sellerName: String,
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, 
  items: [CartItemSchema],
});

export default mongoose.models.Cart ||
  mongoose.model("Cart", CartSchema);