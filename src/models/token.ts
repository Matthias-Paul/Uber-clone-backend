import mongoose, { Document, Schema } from "mongoose";

// Token types enum for type safety
export enum TokenType {
  EMAIL_VERIFICATION = "email_verification",
  PASSWORD_RESET = "password_reset",
}

// Interface for Token document
interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  type: TokenType;
  createdAt: Date;
  updatedAt: Date;
}

// Token Schema
const tokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // Index for faster queries
    },
    token: {
      type: String,
      required: [true, "Token is required"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(TokenType),
        message: "Invalid token type",
      },
      required: [true, "Token type is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
tokenSchema.index({ userId: 1, type: 1 }); 
tokenSchema.index({ token: 1, type: 1 });

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
