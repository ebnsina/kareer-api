import mongoose from "npm:mongoose";

const DATABASE_URI = Deno.env.get("DATABASE_URI");

export async function connectToDB() {
  try {
    await mongoose.connect(DATABASE_URI!);
    console.log(`Database connected successfully.`);
  } catch (error) {
    console.log(`Failed to connect database`);
    console.log(error);
  }
}
