import express, { Request, Response } from "express";

const userRouter = express.Router();

userRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ Hello: "World" });
});

export default userRouter;
