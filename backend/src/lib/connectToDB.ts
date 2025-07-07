import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "Blog",
    });
  } catch (error) {
    console.error(error);
  }
};
