import { Request, Response } from "express";
import Post from "../models/post.model";
import { getAuth } from "@clerk/express";
import User from "../models/user.model";
import ImageKit from "imagekit";
import { config } from "../lib/config";

export const getPosts = async (req: Request, res: Response) => {
  const category = req.query.category;

  const posts = await Post.find(category ? { category } : {})
    .sort({ createdAt: -1 })
    .populate("user", "username img");
  res.status(200).json(posts);
};

export const getOnePost = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const post = await Post.findOne({ slug: slug }).populate(
    "user",
    "username img"
  );
  res.status(200).json(post);
};

export const createPost = async (req: Request, res: Response) => {
  const newPost = req.body;
  const { userId } = getAuth(req);

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // replace spaces with dashes
      .replace(/-+/g, "-"); // remove duplicate dashes
  };
  const baseSlug = generateSlug(newPost.title);
  let slug = baseSlug;
  let counter = 1;

  while (await Post.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const post = await Post.create({ user: user._id, ...newPost, slug: slug });
  res.status(200).json(post);
};

export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const deletedPost = await Post.findOneAndDelete({ _id: id, user: user._id });
  console.log(`USERID: `, user.id);
  console.log(`ID: `, id);
  console.log(deletedPost);
  if (!deletedPost) {
    res.status(403).json({ message: "You can only delete your post" });
    return;
  }

  res.status(200).json(deletedPost);
};

const imagekit = new ImageKit({
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});
export const uploadAuth = async (req: Request, res: Response) => {
  const { token, expire, signature } = imagekit.getAuthenticationParameters();
  console.log(token);
  res.json({
    token,
    name: "farhan",
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
};
