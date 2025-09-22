// lib/seedAdmin.ts
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function seedAdmin() {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10); 
      await User.create({
        name: "Super Admin",
        email: "admin@example.com", 
        password: hashedPassword,
        role: "admin",
      });
      console.log("First admin created successfully.");
    } else {
      console.log("Admin already exists. Skipping seed.");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}
