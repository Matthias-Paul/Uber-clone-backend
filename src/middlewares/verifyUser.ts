import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user";

dotenv.config();

interface CustomRequest extends Request {
  user?: any;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const verifyUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Token has expired. Please log in again",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid token. Unauthorized",
      });
      return;
    }

    // Fallback error handler
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Verification error:", errorMessage);

    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
};
