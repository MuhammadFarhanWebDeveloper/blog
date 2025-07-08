import { Request, Response } from "express";
import Comment from "../models/comment.model";
import { getAuth } from "@clerk/express";
import User from "../models/user.model";

export const getComments = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const comments = await Comment.find({ post: postId }).populate(
    "user",
    "username img"
  );
  res.status(200).json(comments);
};

export const createComment = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const { userId } = getAuth(req);
  const { desc } = req.body;
  const user = await User.findOne({ clerkId: userId });

  const comment = await Comment.create({
    desc,
    user: user?._id,
    post: postId,
  });

  res.status(200).json(comment);
};

export const deleteComment = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });

  const comment = await Comment.findOneAndDelete({ _id: id, user: user?._id });

  if (!comment) {
    res.status(403).json({ message: "You can only delete your own comment" });
    return;
  }

  res.status(200).json(comment);
};
