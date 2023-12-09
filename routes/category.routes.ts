import { Router } from "express";
import { categoryController } from "../controllers/category.controller";

const categoryRouter = Router();

categoryRouter.get("", categoryController.getList);
categoryRouter.get("/:id", categoryController.getById);
categoryRouter.post("", categoryController.create);
categoryRouter.delete("/:id", categoryController.delete);
categoryRouter.put("/:id", categoryController.update);

export default categoryRouter;
