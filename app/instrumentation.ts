import { dbConnect } from "@/lib/dbConnect";

export async function register() {
  console.log("🚀 instrumentation.ts: server starting, connecting DB...");
  await dbConnect();
  console.log("✅ instrumentation.ts: DB connected on startup");
}
