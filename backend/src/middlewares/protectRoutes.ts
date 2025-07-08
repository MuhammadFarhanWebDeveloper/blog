import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

const customRequireAuth = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({
      message: "Unauthorized",
    });

    return;
  }

  next();
};

export default customRequireAuth;
