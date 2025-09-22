import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { use } from "react";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // check email and password coming or not
    if (!email || !password)
      return NextResponse.json(
        { status: false, message: "All fields required" },
        { status: 400 }
      );

    // connect to the DB
    await dbConnect();

    // check user is exist or not
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { status: false, message: "User does not exist" },
        { status: 401 }
      );

    // check enter password and database password match or not
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return NextResponse.json(
        { status: false, message: "Invalid credentails" },
        { status: 401 }
      );

    // Now user is exist in database and password is match

    

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
         role:user.role
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // return NextResponse.json({user,token})

    //remove password from user return response
    const filterUserData = await User.findById(user._id).select(
      "-password -createdAt -__v"
    );

    // create return response
    const response = NextResponse.json({
      status: true,
      data: {
        user:filterUserData,
        token,
      },
    });

    // Set cookie
    response.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
  console.error("Error coming from user login API:", error);
  return NextResponse.json(
    { status: false, message: "Something went wrong" },
    { status: 500 }
  );
}
}
