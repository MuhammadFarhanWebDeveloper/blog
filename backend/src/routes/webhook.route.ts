import express from "express";
import { clerkWebhook } from "../controllers/webhook.controller";

const webhookRouter = express.Router();
webhookRouter.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
  
);
export default webhookRouter;
