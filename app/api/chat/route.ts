import { dbConnect } from "@/lib/dbConnect";
import ChatHistory from "@/models/ChatHistory";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getTokenFromCookies = (req: Request) => {
  const cookies = req.headers.get("cookie");
  if (cookies) {
    const tokenMatch = cookies.match(/accessToken=([^;]+)/);
    if (tokenMatch) {
      return tokenMatch[1];
    }
  }
  return null;
};

const verifyToken = async (req: Request) => {
  try {
    const token = getTokenFromCookies(req);
    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return payload;
  } catch (err) {
    console.error("JWT verification error:", err);
    return null;
  }
};

export async function POST(req: Request) {
  const user = await verifyToken(req);

  // Check user Valid or not
  if (!user) {
    return NextResponse.json(
      { status: false, message: "User Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const { prompt } = await req.json();
    const userId = user._id;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Save chat history
    await ChatHistory.create({
      userId,
      prompt,
      response,
    });

    return NextResponse.json({ response });
  } catch (error: any) {
    console.log("error");
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const user = await verifyToken(req);

  // Check user Valid or not
  if (!user) {
    return NextResponse.json(
      { status: false, message: "User Unauthorized" },
      { status: 401 }
    );
  }
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const history = await ChatHistory.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ status:true, history });
  } catch (error: any) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
