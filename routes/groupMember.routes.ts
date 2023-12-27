import { Router } from "express";
import { groupMemberController } from "../controllers";

const groupMemberRouter = Router();

groupMemberRouter.post("", groupMemberController.create);
groupMemberRouter.put("/:id", groupMemberController.update);
groupMemberRouter.delete("/:id", groupMemberController.delete);
groupMemberRouter.get("/:id", groupMemberController.getById);
groupMemberRouter.get("", groupMemberController.getList);

export default groupMemberRouter;
