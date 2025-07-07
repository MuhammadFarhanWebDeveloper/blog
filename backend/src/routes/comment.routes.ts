import express, { Request, Response } from "express";

const commentRouter = express.Router();

commentRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ Hello: "World" });
});

export default commentRouter;
