import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import Column from "../models/Column.js";
import { Card } from "../models/card.js";

const getById = async (req, res) => {
  const { columnId } = req.params;
  const column = await Column.findById(columnId);
  if (!column) throw HttpError(404);
  const cards = await Card.find({ owner: column._id });
  if (!cards) throw HttpError(404);
  res.json({
    column,
    cards,
  });
};

const addNew = async (req, res) => {
  const { dashboardId } = req.params;
  const result = await Column.create({
    ...req.body,
    owner: dashboardId,
  });
  res.status(201).json(result);
};

const removeById = async (req, res) => {
  const { columnId } = req.params;
  console.log(columnId)
  const result = await Column.findByIdAndDelete(columnId);
  if (!result) throw HttpError(404);
  res.json(result);
};

const updateById = async (req, res) => {
  const { columnId } = req.params;
  console.log(columnId)
  const result = await Column.findByIdAndUpdate(columnId, req.body, {
    new: true,
  });
  if (!result) throw HttpError(404);
  res.json(result);
};

export default {
  getById: ctrlWrapper(getById),
  addNew: ctrlWrapper(addNew),
  removeById: ctrlWrapper(removeById),
  updateById: ctrlWrapper(updateById),
};
