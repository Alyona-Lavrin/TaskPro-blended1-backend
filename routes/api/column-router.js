import express from "express";
import {
  authenticate,
  isEmptyBody,
  isValidIdDashboard,
} from "../../midelwares/index.js";
import column from "../../controllers/column.js";
import { columnAddSchema } from "../../models/Column.js";
import valBody from "../../decorators/valBody.js";

const columnRouter = express.Router();
columnRouter.use(authenticate);

columnRouter.get("/:columnId", column.getById);
columnRouter.post(
  "/:dashboardId",
  authenticate,
  isValidIdDashboard,
  isEmptyBody,
  valBody(columnAddSchema),
  column.addNew
);
columnRouter.put(
  "/:columnId",
  // isValidIdDashboard,
  // isEmptyBody,
  valBody(columnAddSchema),
  column.updateById
);
columnRouter.delete("/:columnId", column.removeById);

export default columnRouter;
