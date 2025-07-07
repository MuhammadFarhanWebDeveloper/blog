import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      required: true,
      unique: true,
      type: String,
    },
    email: {
      required: true,
      unique: true,
      type: String,
    },

    img: {
      type: String,
    },
    savedPosts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
