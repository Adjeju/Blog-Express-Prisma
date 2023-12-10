import { Router } from "express";
import { postLikeController } from "../controllers/postLike.controller";
import { verifyToken } from "../middlewares";

const postLikeRouter = Router();

postLikeRouter.use(verifyToken);

postLikeRouter.get("", postLikeController.getList);
postLikeRouter.post("/:id", postLikeController.create);
postLikeRouter.delete("/:id", postLikeController.delete);

export default postLikeRouter;
