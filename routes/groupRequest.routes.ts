import { Router } from "express";
import { groupRequestController } from "../controllers";
import { verifyToken } from "../middlewares";

const groupRequestRouter = Router();

groupRequestRouter.get("", groupRequestController.getList);
groupRequestRouter.get("/:id", groupRequestController.getById);
groupRequestRouter.post("", verifyToken, groupRequestController.create);
groupRequestRouter.put("/:id", groupRequestController.update);
groupRequestRouter.delete("/:id", groupRequestController.delete);

export default groupRequestRouter;
