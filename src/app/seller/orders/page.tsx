"use client";

import { useEffect, useState } from "react";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { getUserFromStorage } from "@/lib/auth";

export default function SellerOrdersPage() {
  useRoleGuard("seller");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = getUserFromStorage();

    if (!user?._id) return;

    fetch(`/api/orders/seller?sellerId=${user._id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <h1>Seller Orders</h1>
    </div>
  );
}