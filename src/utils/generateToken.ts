import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "express";
import { Types } from "mongoose";

dotenv.config();

const generateToken = async (
  userId: Types.ObjectId,
  role: string,
  res: Response
): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  const userToken = jwt.sign({ userId, role }, secret, {
    expiresIn: "7d",
  });

  return userToken;
};

export default generateToken;
