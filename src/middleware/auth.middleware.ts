import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/user.model";
import { AuthenticatedRequest, UserPayload } from "../types/type";

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }
    const userPayload: UserPayload = {
      id: user._id as any, // cast to any to avoid type issues
      role: user.role,
      username: user.username,
    };

    req.user = userPayload;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid request!",
    });
  }
};

export default authMiddleware;
