import mongoose, { Schema, Document, Model } from "mongoose";

export interface ChatHistoryInterface extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  response: string;
  createdAt: Date;
}

const ChatHistorySchema: Schema<ChatHistoryInterface> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatHistory: Model<ChatHistoryInterface> =
  mongoose.models.ChatHistory ||
  mongoose.model<ChatHistoryInterface>("ChatHistory", ChatHistorySchema);

export default ChatHistory;
