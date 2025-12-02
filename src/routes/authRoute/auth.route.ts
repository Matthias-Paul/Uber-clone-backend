import express from "express";
import { verifyUser } from "../../middlewares/verifyUser";
import { registerValidation, loginValidation, verifyEmailTokenValidation } from "../../middlewares/validation";
import {
  registerUsers,
  verifyEmailToken,
  loginUsers,
} from "../../controllers/authController/auth.controller";


const router = express.Router();

router.post("/register", registerValidation, registerUsers);
router.post(
  "/verify-email",
  verifyEmailTokenValidation,
  verifyUser,
  verifyEmailToken
);

router.post("/login", loginValidation, loginUsers);

export default router;
