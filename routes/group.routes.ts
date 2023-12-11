import { Router } from "express";
import { groupController } from "../controllers";
import { verifyToken } from "../middlewares";

export const groupRouter = Router();

groupRouter.get("", groupController.getList);
groupRouter.post("", verifyToken, groupController.create);
groupRouter.get("/:id", groupController.getById);
groupRouter.put("/:id", groupController.update);
groupRouter.delete("/:id", groupController.delete);

export default groupRouter;
