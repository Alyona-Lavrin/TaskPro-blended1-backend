import { ctrlWrapper } from "../decorators/index.js";
import Dashboard from "../models/Dashboards.js";
import HttpError from "../helpers/HttpError.js";
const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Dashboard.find({ owner }, "-createdAt -updatedAt");
  res.json(result);
};

const getById = async (req, res, next) => {
  const { dashboardId } = req.params;
  const result = await Dashboard.findById(dashboardId);
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { dashboardId } = req.params;
  const result = await Dashboard.findByIdAndDelete(dashboardId);
  //   await Column.deleteMany({ dashboardId });
  //   await Card.deleteMany({ dashboardId });
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json({
    message: "Delete success",
  });
};

const addNew = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Dashboard.create({ ...req.body, owner });
  res.status(201).json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  deleteById: ctrlWrapper(deleteById),
  addNew: ctrlWrapper(addNew),
};
