import { Router } from "express";
import { groupRoleController } from "../controllers/groupRole.controller";

const groupRoleRouter = Router();

groupRoleRouter.get("/:id", groupRoleController.getById);
groupRoleRouter.get("", groupRoleController.getList);
groupRoleRouter.post("", groupRoleController.create);
groupRoleRouter.put("/:id", groupRoleController.update);
groupRoleRouter.delete("/:id", groupRoleController.delete);

export default groupRoleRouter;
