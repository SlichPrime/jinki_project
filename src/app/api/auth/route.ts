import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.email === "admin@test.com" && body.password === "1234") {
    return NextResponse.json({
      token: "fake-jwt-token",
      user: { email: body.email },
    });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}