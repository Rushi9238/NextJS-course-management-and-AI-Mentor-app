import mongoose, { Schema, Document, Model } from "mongoose";

interface Message {
  role: "user" | "ai";
  content: string;
  createdAt: Date;
}

export interface ChatSessionInterface extends Document {
  userId: mongoose.Types.ObjectId;
  sessionName: string;
  messages: Message[];
  createdAt: Date;
}

const MessageSchema = new Schema<Message>(
  {
    role: { type: String, enum: ["user", "ai"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSessionSchema: Schema<ChatSessionInterface> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sessionName: { type: String, default: "New Chat" },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
});

const ChatSession: Model<ChatSessionInterface> =
  mongoose.models.ChatSession ||
  mongoose.model<ChatSessionInterface>("ChatSession", ChatSessionSchema);

export default ChatSession;
