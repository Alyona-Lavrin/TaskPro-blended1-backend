import express from "express";
import * as dashboardSchemas from "../../models/Dashboards.js";
import dashboardController from "../../controllers/dashboards-controller.js";
import { authenticate } from "../../midelwares/index.js";

const dashboardRouter = express.Router();
dashboardRouter.get("/", authenticate, dashboardController.getAll);
dashboardRouter.post("/", authenticate, dashboardController.addNew);
dashboardRouter.get("/:dashboardId", dashboardController.getById);
dashboardRouter.delete("/:dashboardId", dashboardController.deleteById);
export default dashboardRouter;
