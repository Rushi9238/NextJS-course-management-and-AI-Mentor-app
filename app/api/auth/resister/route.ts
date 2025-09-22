import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json(
        { status: false, error: "All feilds required", data: [] },
        { status: 400 }
      );

    // Check Email Validation ex. test@jas.com/in
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return NextResponse.json(
        { error: "Invalid email id", status: false, data: [] },
        { status: 400 }
      );

    await dbConnect();

    //check user exist or not
    const userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json(
        { status: false, error: "User already exist in database", data: [] },
        { status: 409 }
      );
    }

    // Convert Hashed password using bcrypt
    const hashed = await bcrypt.hash(password, 10);

    //Add user in database
    const userDetails = await User.create({
      name,
      email,
      password: hashed,
    });

    //remove password from user return response
    const filterUserData = await User.findById(userDetails._id).select(
      "-password -createdAt -__v"
    );

    // check filter user data is not coming
    if (!filterUserData) {
      return NextResponse.json({
        status: false,
        error: "Something went wrong user is created go to sign in page",
        data: [],
      });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        _id: filterUserData._id,
        name: filterUserData.name,
        email: filterUserData.email,
        role:filterUserData.role
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const response = NextResponse.json({
      status: true,
      data: {
        user: filterUserData,
        token
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

    return response
  } catch (error) {
    console.error("Error coming from user resister API : ", error);
    return NextResponse.json(
      {
        status: false,
        error: "Server Error",
        message: error,
      },
      {
        status: 500,
      }
    );
  }
}
