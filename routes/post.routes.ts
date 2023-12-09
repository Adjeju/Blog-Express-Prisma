import { Router } from "express";
import { postController } from "../controllers";

const postRouter = Router();

postRouter.post("", postController.create);
postRouter.put("/:id", postController.update);
postRouter.delete("/:id", postController.delete);
postRouter.get("", postController.getList);
postRouter.get("/:id", postController.getById);

export default postRouter;
