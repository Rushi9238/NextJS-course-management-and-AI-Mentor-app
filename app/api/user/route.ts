import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

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
    console.error('JWT verification error:', err);
    return null;
  }
};

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
    const users = await User.find().select("-password -__v");
    return NextResponse.json({ status: true, data: users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
}
}

export async function POST(req: Request) {
  const user = await verifyToken(req);

     // Check user Valid or not
  if (!user || user.role!=='admin') {
    return NextResponse.json(
      { status: false, message: "User Unauthorized" },
      { status: 401 }
    );
  }

    try {
    await dbConnect();
    const { name, email, mobileNumber, role,status } = await req.json();

    

    if (!name || !email) {
      return NextResponse.json(
        { status: false, message: "User Name & email required" },
        { status: 400 }
      );
    }

    // check user is exist or not
    const exist = await User.findOne({ email });
    if (exist) {
      return NextResponse.json(
        { status: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const dummyPassword=`${name.trim().split(" ").join("")}@123`
    const hashedPassword = await bcrypt.hash(dummyPassword,10)

    const newUser = await User.create({
      name,
      email,
      password:hashedPassword,
      mobileNumber,
      role: role || "student",
      status:status || "active"
    });

    return NextResponse.json(
      { status: true, message: "User created successfully", data: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }



}

export async function PUT(req: Request) {
      const user = await verifyToken(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { status: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

    try {
    await dbConnect();
    const { _id, name, mobileNumber, role, status } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { status: false, message: "User ID required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, mobileNumber, role, status },
      { new: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return NextResponse.json(
        { status: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: true, message: "User updated successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
    const user = await verifyToken(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { status: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const { _id,status } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { status: false, message: "User ID required" },
        { status: 400 }
      );
    }

    const suspendedUser = await User.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    ).select("-password -__v");

    if (!suspendedUser) {
      return NextResponse.json(
        { status: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: true, message: "User suspended successfully", data: suspendedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}
