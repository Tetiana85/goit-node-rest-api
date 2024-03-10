import express from "express";
import authControllers from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

import validateBody from "../helpers/validateBody.js";
import { upload } from "../middlewares/upload.js";

import {
  loginSchema,
  registerSchema,
  subscriptionShema,
} from "../models/users.js";

const authRouter = express.Router();
const { register, login, current, logout, subscription, updateAvatar } =
  authControllers;

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, current);
authRouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionShema),
  subscription
);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;
