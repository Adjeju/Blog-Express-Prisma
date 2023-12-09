import { Router } from "express";
import { userController } from "../controllers";
import { upload } from "../middlewares";

const userRouter = Router();

userRouter.get("", userController.getList);
userRouter.get("/:id", userController.getById);
userRouter.put("/:id", upload.single("avatar"), userController.update);
userRouter.delete("/:id", userController.delete);

export default userRouter;
