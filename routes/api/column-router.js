import express from "express";
import {
  authenticate,
  isEmptyBody,
  isValidIdDashboard,
} from "../../midelwares";
import column from "../../controllers/column";
import { columnAddSchema } from "../../models/Column";

const columnRouter = express.Router();
columnRouter.use(authenticate);

columnRouter.get("/:columnId", column.getById);
columnRouter.post(
  "/:columnId",
  isValidIdDashboard,
  isEmptyBody,
  valBody(columnAddSchema),
  column.addNew
);
columnRouter.put(
  "/:columnId",
  isValidIdDashboard,
  isEmptyBody,
  valBody(columnAddSchema),
  column.updateById
);
columnRouter.delete("/:columnId", isValidIdDashboard, column.removeById);

export default columnRouter;
