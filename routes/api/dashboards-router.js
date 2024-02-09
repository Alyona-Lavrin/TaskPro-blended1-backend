import express from "express";
import * as dashboardSchemas from "../../models/Dashboards.js";
import dashboardController from "../../controllers/dashboards-controller.js";
import { valBody } from "../../decorators/index.js";
import {
  authenticate,
  isEmptyBody,
  isValidIdDashboard,
} from "../../midelwares/index.js";

const dashboardAddValidate = valBody(dashboardSchemas.dashboardAddSchema);

const dashboardRouter = express.Router();
dashboardRouter.get("/", authenticate, dashboardController.getAll);
dashboardRouter.post(
  "/",
  authenticate,
  dashboardAddValidate,
  isEmptyBody,
  dashboardController.addNew
);
dashboardRouter.post(
  "/help",
  isEmptyBody,
  valBody(dashboardSchemas.needHelpSchema),
  dashboardController.needHelp
);
dashboardRouter.get(
  "/:dashboardId",
  authenticate,
  isValidIdDashboard,
  dashboardController.getById
);
dashboardRouter.delete(
  "/:dashboardId",
  authenticate,
  isValidIdDashboard,
  dashboardController.deleteById
);
dashboardRouter.put(
  "/:dashboardId",
  authenticate,
  isValidIdDashboard,
  isEmptyBody,
  isValidIdDashboard,
  dashboardController.updateById
);
export default dashboardRouter;
