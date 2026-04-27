"use client";

import { useState } from "react";

export default function useCart() {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart((prev) => [...prev, product]);
  };

  return { cart, addToCart };
}