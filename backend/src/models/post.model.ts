import { model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    img: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
    content: {
      type: String,
      required: true,
      minLength: [50, "Content is too short"],
    },
    visit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Post = model("Post", postSchema);
export default Post;
