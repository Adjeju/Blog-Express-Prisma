import { Router } from "express";
import { routes } from "../constants";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import postRouter from "./post.routes";
import categoryRouter from "./category.routes";
import tagRouter from "./tag.routes";
import commentRouter from "./comment.routes";
import postLikeRouter from "./postLike.routes";

const router = Router();

router.use(routes.auth, authRouter);
router.use(routes.user, userRouter);
router.use(routes.post, postRouter);
router.use(routes.category, categoryRouter);
router.use(routes.tag, tagRouter);
router.use(routes.comment, commentRouter);
router.use(routes.postLike, postLikeRouter);

export default router;
