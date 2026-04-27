import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
  type: String,
  required: true, 
  default: "",
},
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    // 🏪 Seller-specific fields
    storeName: {
      type: String,
      default: null,
    },

    storeLocation: {
      type: String,
      default: null,
    },

   address: {
  phone: String,
  city: String,
  postal_code: String,
  address_line: String,
},
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);