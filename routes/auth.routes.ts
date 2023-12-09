import { Router } from "express";
import { authController } from "../controllers";
import { upload } from "../middlewares";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/signup", upload.single("avatar"), authController.signup);

export default authRouter;
