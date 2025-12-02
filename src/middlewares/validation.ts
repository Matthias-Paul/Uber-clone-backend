import { body, param } from "express-validator";

export const registerValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["rider", "driver"]) 
    .withMessage("Invalid role"),
];

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

  export const verifyEmailTokenValidation = [
    body("token")
      .notEmpty()
      .withMessage("Verification token is required")
      .isLength({ min: 6 })
      .withMessage("Token must be at least 6 numbers"),

  ];


