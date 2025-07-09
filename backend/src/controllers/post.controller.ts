import { Request, Response } from "express";
import Post from "../models/post.model";
import { getAuth } from "@clerk/express";
import User from "../models/user.model";
import ImageKit from "imagekit";
import { config } from "../lib/config";
const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getPosts = async (req: Request, res: Response) => {
  const category = req.query.category;
  const limit = parseInt(req.query.limit as string) || 5;
  const page = parseInt(req.query.page as string) || 1;
  const q = (req.query.search as string | undefined)?.trim();
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};
  if (category) filter.category = category;

  if (q) {
    // Case-insensitive search on title + description
    const safe = escapeRegExp(q);
    filter.$or = [
      { title: { $regex: safe, $options: "i" } },
      { description: { $regex: safe, $options: "i" } },
    ];
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username clerkId img"),
    Post.countDocuments(filter),
  ]);

  const hasMore = page * limit < total;

  res.status(200).json({ posts, nextPage: hasMore ? page + 1 : null });
};

export const getOnePost = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    let viewedPosts: string[] = [];

    if (req.cookies?.viewedPosts) {
      try {
        viewedPosts = JSON.parse(req.cookies.viewedPosts);
      } catch (err) {
        console.error("Failed to parse viewedPosts cookie:", err);
      }
    }

    const alreadyViewed = viewedPosts.includes(slug);

    if (!alreadyViewed) {
      await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });
      viewedPosts.push(slug);
      res.cookie("viewedPosts", JSON.stringify(viewedPosts), {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });
    }

    const post = await Post.findOne({ slug }).populate(
      "user",
      "username clerkId img"
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
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
