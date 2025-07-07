import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/user.model";
import { UserJSON } from "@clerk/express";
export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    const eventData = evt.data as UserJSON;

    if (eventType === "user.created") {
      const newUser = await User.create({
        clerkId: eventData.id,
        email: eventData.email_addresses[0].email_address,
        username:
          eventData.username || eventData.email_addresses[0].email_address,
        img: eventData.image_url,
      });
      res.status(200).json({ message: "User created successfully" });
      return;
    }

    if (eventType === "user.deleted") {
      console.log("USER deleted event...")
      const deletedUser = await User.findOneAndDelete({
        clerkId: eventData.id,
      });
      res.status(200).json({ message: "User deleted successfully" });

      return;
    }

    if (eventType === "user.updated") {
      return;
    }
  } catch (err) {
    console.error("Error verifying webhook:", err);
    res.status(400).send("Error verifying webhook");
  }
};
