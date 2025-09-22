// app/api/test-connection/route.ts

import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "MongoDB connected successfully" });
  } catch (err) {
    console.error("Connection failed:", err);
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
