import { Router } from "express";
import { commentController } from "../controllers";

const commentRouter = Router();

commentRouter.post("", commentController.create);
commentRouter.delete("/:id", commentController.delete);
commentRouter.put("/:id", commentController.update);
commentRouter.get("/:id", commentController.getById);
commentRouter.get("", commentController.getList);

export default commentRouter;
