import { Request, Response } from "express";
import Post from "../models/post.model";
import { arrayBuffer } from "stream/consumers";
import { getAuth } from "@clerk/express";
import User from "../models/user.model";
import { Z_FIXED } from "zlib";

export const getPosts = async (req: Request, res: Response) => {
  const posts = await Post.find();
  res.status(200).json(posts);
};

export const getOnePost = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const post = await Post.findOne({ slug: slug });
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
  const post = await Post.create({ user: user._id, ...newPost });
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

  const deletedPost = await Post.findOneAndDelete({ id, user: user._id });
  if (!deletedPost) {
    res.status(403).json({message:"You can only delete your post"})
    return;
  }

  res.status(200).json(deletedPost);
};
