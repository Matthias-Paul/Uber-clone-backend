import { Request, Response, NextFunction } from "express";
import User from "../../models/user";
import { validationResult, matchedData } from "express-validator";
import generatedToken from "../../utils/generateToken";
import OTPGenerator from "otp-generator";
import Token, { TokenType } from "../../models/token";
import { EmailService } from "../../utils/emailService";

export const registerUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
    return;
  }

  try {
    const { username, email, password, role } = matchedData(req);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Email already exists",
      });
      return;
    }

    // Create new user (password will be hashed automatically by the pre-save hook)
    const user = new User({
      username,
      email,
      password,
      role,
      verified_user: false,
    });

    await user.save();

    // Generate JWT token
    const jwtToken = await generatedToken(user._id, user.role, res);
    console.log("JWT Token:", jwtToken);
 
    // Generate 6-digit OTP
    const OTP = OTPGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    console.log("Generated OTP:", OTP);

    // const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Check if token exists for this user
    let emailToken = await Token.findOne({
      userId: user._id,
      type: TokenType.EMAIL_VERIFICATION,
    });

    if (emailToken) {
      // Update existing token
      emailToken.token = OTP;
      await emailToken.save();
    } else {
      // Create new token
      emailToken = await Token.create({
        userId: user._id,
        type: TokenType.EMAIL_VERIFICATION,
        token: OTP,
      });
    }

    // Send verification email
    await EmailService.sendVerificationEmail(email, username, OTP);

    res.status(201).json({
      statusCode: 201,
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          verified: user.verified_user,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};
