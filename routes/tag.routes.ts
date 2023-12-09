import { Router } from "express";
import { tagController } from "../controllers";

const tagRouter = Router();

tagRouter.get("", tagController.getList);
tagRouter.get("/:id", tagController.getById);
tagRouter.post("", tagController.create);
tagRouter.delete("/:id", tagController.delete);
tagRouter.put("/:id", tagController.update);

export default tagRouter;
