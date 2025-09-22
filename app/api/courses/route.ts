import { dbConnect } from "@/lib/dbConnect";
import Courses from "@/models/Course";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getTokenFromCookies = (req: Request) => {
  const cookies = req.headers.get("cookie");
  if (cookies) {
    const tokenMatch = cookies.match(/accessToken=([^;]+)/);
    if (tokenMatch) return tokenMatch[1];
  }
  return null;
};

const verifyToken = async (req: Request) => {
  try {
    const token = getTokenFromCookies(req);
    if (!token) return null;
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

// Create Course
export async function POST(req: Request) {
  const user = await verifyToken(req);

//   return NextResponse.json({user})

  if (!user || user.role === "student") {
    return NextResponse.json(
      { status: false, message: "User Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const { title, category, description,duration, level, price } = await req.json();

    if (!title?.trim() || !category?.trim() || !description?.trim()) {
      return NextResponse.json(
        { status: false, message: "Title, Category and Description are required" },
        { status: 400 }
      );
    }

    const newCourse = await Courses.create({
      title,
      category,
      description,
      level,
      price,
      duration,
      createdBy: user._id, // userId from token
    });

    return NextResponse.json(
      { status: true, message: "Course created successfully", data: newCourse },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}

// Get courses list
export async function GET(req:Request) {
    const user = await verifyToken(req);
 if (!user) {
    return NextResponse.json(
      { status: false, message: "User Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const courses = await Courses.find()
      .populate("createdBy", "name email role"); // 👈 User मधले fields fetch होतील

    return NextResponse.json(
      { status: true, data: courses },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}

// Update the Course
export async function PUT(req: Request) {
  const user = await verifyToken(req);
  if (!user || user.role === "student") {
    return NextResponse.json(
      { status: false, message: "User Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const { _id, title, category, description, duration, level, price } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { status: false, message: "Course ID is required" },
        { status: 400 }
      );
    }

    const updatedCourse = await Courses.findByIdAndUpdate(
      _id,
      { title, category, description, level, duration, price },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { status: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: true, message: "Course updated successfully", data: updatedCourse },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
