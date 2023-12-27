import { Router } from "express";
import { routes } from "../constants";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import postRouter from "./post.routes";
import categoryRouter from "./category.routes";
import tagRouter from "./tag.routes";
import commentRouter from "./comment.routes";
import postLikeRouter from "./postLike.routes";
import groupRouter from "./group.routes";
import groupInviteRouter from "./groupRequest.routes";
import groupRoleRouter from "./groupRole.routes";
import groupMemberRouter from "./groupMember.routes";

const router = Router();

router.use(routes.auth, authRouter);
router.use(routes.user, userRouter);
router.use(routes.post, postRouter);
router.use(routes.category, categoryRouter);
router.use(routes.tag, tagRouter);
router.use(routes.comment, commentRouter);
router.use(routes.postLike, postLikeRouter);
router.use(routes.group, groupRouter);
router.use(routes.groupRequest, groupInviteRouter);
router.use(routes.groupRole, groupRoleRouter);
router.use(routes.groupMember, groupMemberRouter);

export default router;
