import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import User from "../../models/user";
import { validationResult, matchedData } from "express-validator";
import generatedToken from "../../utils/generateToken";
import OTPGenerator from "otp-generator";
import Token, { TokenType } from "../../models/token";
import { EmailService } from "../../utils/emailService";

interface CustomRequest extends Request {
  user?: any;
}

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
          jwtToken,
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

export const verifyEmailToken = async (
  req: CustomRequest,
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
    const userId = req.user._id;
    const { token } = matchedData(req);

    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Invalid token",
      });
      return;
    }

    if (user.verified_user) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Email already verified",
      });
      return;
    }

    const tokenDoc = await Token.findOne({
      userId: user._id,
      type: TokenType.EMAIL_VERIFICATION,
      token,
    });

    if (!tokenDoc) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Invalid OTP",
      });
      return;
    }

    const expiryTime = tokenDoc.updatedAt.getTime() + 10 * 60 * 1000;

    if (Date.now() > expiryTime) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
      return;
    }

    // Update user
    user.verified_user = true;
    await user.save();

    // Delete token
    await Token.deleteOne({ _id: tokenDoc._id });
    // Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.username);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Email verified successfully!",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          verified: user.verified_user,
        },
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);

    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginUsers = async (
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
    const { email, password } = matchedData(req);

    const validUser = await User.findOne({ email });
    if (!validUser) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Invalid Credentials",
      });
      return;
    }

    const isMatch = await bcryptjs.compare(password, validUser.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid Credentials.",
      });
      return;
    }

    // If user is not verified, send OTP again
    if (!validUser.verified_user) {
      const OTP = OTPGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });

      let emailToken = await Token.findOne({
        userId: validUser._id,
        type: TokenType.EMAIL_VERIFICATION,
      });

      if (emailToken) {
        emailToken.token = OTP;
        await emailToken.save();
      } else {
        emailToken = await Token.create({
          userId: validUser._id,
          type: TokenType.EMAIL_VERIFICATION,
          token: OTP,
        });
      }

      // Send email
      await EmailService.sendVerificationEmail(
        validUser.email,
        validUser.username,
        OTP
      );

      res.status(403).json({
        statusCode: 403,
        success: false,
        message:
          "Your email is not verified. A verification code has been sent to your email.",
      });

      return;
    }

    // Now login successfully → generate JWT
    const jwtToken = await generatedToken(validUser._id, validUser.role, res);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: validUser._id,
          username: validUser.username,
          email: validUser.email,
          role: validUser.role,
          verified: validUser.verified_user,
          jwtToken,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};
