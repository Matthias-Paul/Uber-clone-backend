import express from "express";
import { verifyUser } from "../../middlewares/verifyUser";
import { registerValidation, loginValidation, verifyEmailTokenValidation } from "../../middlewares/validation";
import {
  registerUsers,
  verifyEmailToken,
  loginUsers,
} from "../../controllers/authController/auth.controller";


const router = express.Router();

router.post("/auth/register", registerValidation, registerUsers);
router.post(
  "/auth/verify-email",
  verifyEmailTokenValidation,
  verifyEmailToken
);

router.post("/auth/login", loginValidation, loginUsers);

export default router;
