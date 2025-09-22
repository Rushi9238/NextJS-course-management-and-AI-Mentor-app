import mongoose, { Document, Schema, Model } from "mongoose";

export interface courseInterface extends Document {
  title: string;
  category: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  price: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema<courseInterface> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    duration:{
        type:String,
        required:[true, "Course duraction is required"],
        trim:true
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },  
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Courses: Model<courseInterface> = mongoose.models.Courses || mongoose.model<courseInterface>("Courses", CourseSchema);

export default Courses;

