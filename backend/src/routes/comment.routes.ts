import express, { Request, Response } from "express";
import customRequireAuth from "../middlewares/protectRoutes";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller";

const commentRouter = express.Router();

commentRouter.get("/:postId", getComments);
commentRouter.post("/:postId", customRequireAuth, createComment);
commentRouter.delete("/:id", customRequireAuth, deleteComment);
export default commentRouter;
