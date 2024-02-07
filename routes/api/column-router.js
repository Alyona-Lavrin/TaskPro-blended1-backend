import express from "express";
import { authenticate } from "../../midelwares";
import column from "../../controllers/column";

const columnRouter = express.Router();

columnRouter.get("/:columnId", authenticate, column.getById);
columnRouter.post("/:dashboardId", authenticate, column.addNew);
columnRouter.put("/:columnId", authenticate, column.updateById);
columnRouter.delete("/:columnId", authenticate, column.removeById);

export default columnRouter;
