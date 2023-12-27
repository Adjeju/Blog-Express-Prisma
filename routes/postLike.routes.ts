import { Router } from "express";
import { verifyToken } from "../middlewares";
import { postLikeController } from "../controllers";

const postLikeRouter = Router();

postLikeRouter.use(verifyToken);

postLikeRouter.get("", postLikeController.getList);
postLikeRouter.post("/:id", postLikeController.create);
postLikeRouter.delete("/:id", postLikeController.delete);

export default postLikeRouter;
