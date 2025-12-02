import express from "express";

import { registerValidation, loginValidation } from "../../middlewares/validation";
import { registerUsers } from "../../controllers/authController/auth.controller";


const router = express.Router();

router.post("/register", registerValidation, registerUsers);

// router.post("/login", loginValidation, loginUsers);
// router.post("/logout", logoutUsers);

export default router;
