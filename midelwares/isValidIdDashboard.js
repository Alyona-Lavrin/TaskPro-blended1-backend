import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isValidIdDashboard = (req, res, next) => {
  const { dashboardId } = req.params;
  if (!isValidObjectId(dashboardId)) {
    return next(HttpError(404, `${dashboardId} is not valid id`));
  }
  next();
};
export default isValidIdDashboard;
