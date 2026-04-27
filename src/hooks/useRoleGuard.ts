"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromStorage } from "@/lib/auth";

type Role = "seller" | "customer" | "admin";

export function useRoleGuard(requiredRole: Role) {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromStorage();

    if (!user) {
      router.push("/login");
      return;
    }

    const userRole = user?.role?.toLowerCase();

    if (userRole !== requiredRole) {
      router.push("/unauthorized"); // or show message page
      return;
    }
  }, [requiredRole, router]);
}