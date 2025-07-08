import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.routes";
import commentRouter from "./routes/comment.routes";
import webhookRouter from "./routes/webhook.route";
import { connectToDB } from "./lib/connectToDB";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import ImageKit from "imagekit";

const app = express();
const PORT = 3000;

dotenv.config();
app.use(clerkMiddleware());
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});
app.use("/webhooks", webhookRouter);
interface ErrorWithStatus extends Error {
  status?: number;
}
console.log(process.env.IMAGEKIT_PUBLIC_KEY);
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript + Express!");
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use(
  (error: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);

    res.json({
      message: error.message || "Something went wrong",
      status: error.status,
      stack: error.stack,
    });
  }
);
const startServer = async () => {
  await connectToDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
