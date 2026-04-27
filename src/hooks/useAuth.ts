"use client";

import { useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState<any>(null);

  // ======================
  // LOGIN
  // ======================
const handleLogin = async (data: { email: string; password: string }) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.message || "Login failed");
    return;
  }

  // 🔥 THIS LINE WAS MISSING BEFORE
  localStorage.setItem("token", result.token);

  // already correct
  localStorage.setItem(
  "user",
  JSON.stringify({
    ...result.user,
    _id: result.user.id, // normalize
  })
);

  window.location.href = "/profile";
};

  // ======================
  // REGISTER
  // ======================
  const handleRegister = async (data: any) => {
    try {
      const res = await fetch("/api/auth/register", { // ✅ FIXED
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Register failed");
        return;
      }

      alert("Account created successfully!");
      window.location.href = "/profile";

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return { user, handleLogin, handleRegister };
}