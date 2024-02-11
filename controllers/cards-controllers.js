import HttpError from "./../helpers/HttpError.js";
import { Card } from "../models/card.js";
import Column from "../models/Column.js";
import { ctrlWrapper } from "../decorators/index.js";

const addCard = async (req, res) => {
  const { columId } = req.params;
  const exsistColumn = await Column.findById(columId);
  if (!exsistColumn) {
    throw HttpError(404, `Column with id=${columId} not found`);
  }
  const result = await Card.create({ ...req.body, owner: columId });
  res.status(201).json(result);
};

const deleteCard = async (req, res) => {
  const { cardsId } = req.params;
  const result = await Card.findByIdAndDelete(cardsId);
  if (!result) {
    throw HttpError(404`Card with id=${id} not found`);
  }
  res.status(200).json(result);
};

const transportCard = async (req, res) => {
  const { id } = req.params;
  const { source, destination } = req.body;
  const exsistColumn = await Column.findById(source);
  if (!exsistColumn) {
    throw HttpError(400, `Column with id=${source} not found`);
  }
  const result = await Card.findByIdAndUpdate(
    id,
    { column: destination },
    { new: true }
  );
  if (!result) {
    throw HttpError(404, `Card with id=${id} not found`);
  }
  res.json(result);
};

const updateCard = async (req, res) => {
  const { cardsId } = req.params;
  console.log(req.body)
  const result = await Card.findByIdAndUpdate(cardsId, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Card with id=${cardsId} not found`);
  }

  res.json(result);
};

const updateStatus = async (req, res) => {
  const { cardsId, owner: oldOwner } = req.params;
  console.log(oldOwner)
  const { columnId } = req.body;
  console.log(columnId)
  const result = await Card.findByIdAndUpdate(cardsId, { owner: columnId }, { new: true });
  if (!result) {
    throw HttpError(404, `Card with id=${cardsId} not found`);
  }

  res.json({ result, oldOwner });
};

export default {
  addCard: ctrlWrapper(addCard),
  deleteCard: ctrlWrapper(deleteCard),
  transportCard: ctrlWrapper(transportCard),
  updateCard: ctrlWrapper(updateCard),
  updateStatus: ctrlWrapper(updateStatus),
};
