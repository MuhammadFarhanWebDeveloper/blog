import express from "express";
import {
  createPost,
  deletePost,
  getOnePost,
  getPosts,
  uploadAuth,
} from "../controllers/post.controller";
import { requireAuth } from "@clerk/express";
import customRequireAuth from "../middlewares/protectRoutes";

const postRouter = express.Router();

postRouter.get("/", getPosts);

postRouter.get("/upload-auth", uploadAuth);
postRouter.get("/:slug", getOnePost);
postRouter.post("/", customRequireAuth, createPost);
postRouter.delete("/:id", customRequireAuth, deletePost);

export default postRouter;
