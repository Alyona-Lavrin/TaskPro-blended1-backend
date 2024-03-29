import { ctrlWrapper } from "../decorators/index.js";
import Dashboard from "../models/Dashboards.js";
import HttpError from "../helpers/HttpError.js";
import sendHelpEmail from "../helpers/sendHelpEmail.js";
import Column from "../models/Column.js";
import { Card } from "../models/card.js";
const getAll = async (req, res, next) => {
	const { _id: owner } = req.user;
	const result = await Dashboard.find({ owner }, "-createdAt -updatedAt");
	res.json(result);
};

const getById = async (req, res, next) => {
	const { dashboardId } = req.params;
	const result = await Dashboard.findById(dashboardId);
	console.log(result);
	const columns = await Column.find({ owner: result._id });
	if (!result) {
		throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
	}
	if (columns.length) {
		const aggregatedData = await Column.aggregate([
			{
				$match: { $or: columns }, // фільтрує документи на основі вказаної умови
			},
			{
				$lookup: {
					from: "cards", //  об'єднання документів з колекції "Column" з документами з колекції "cards" на основі вказаних полів (_id в "Column" та owner в "cards")
					localField: "_id",
					foreignField: "owner",
					as: "card",
				},
			},
		]);

		res.json({ result, column: aggregatedData });
	}
	res.json({
		result,
		column: [],
	});
};

const updateById = async (req, res) => {
	const { dashboardId } = req.params;
	const result = await Dashboard.findByIdAndUpdate(dashboardId, req.body, {
		new: true,
	});
	if (!result) {
		throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
	}
	res.json(result);
};
const deleteById = async (req, res, next) => {
	const { dashboardId } = req.params;
	const result = await Dashboard.findByIdAndDelete(dashboardId);
	const columnsForDelete = await Column.find({ owner: dashboardId });
	const deletedColumns = await Column.deleteMany({ owner: dashboardId });

	console.log(columnsForDelete);
	const arrayId = columnsForDelete.map(item => item.dashboardId);
	await Card.deleteMany({ owner: arrayId });
	if (!result) {
		throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
	}
	res.json({
		_id: dashboardId,
		deletedColumns,
		message: "Delete success",
	});
};

const addNew = async (req, res, next) => {
	const { _id: owner } = req.user;
	const result = await Dashboard.create({ ...req.body, owner });
	res.status(201).json(result);
};

const needHelp = async (req, res) => {
	const request = req.body;

	if (!request) {
		throw HttpError(400, `missing fields email or comment`);
	}
	const help = {
		to: "taskpro.project@gmail.com",
		subject: "Need Help",
		html: `<div><strong>User: ${request.email}</strong><p>${request.comment}</p> </div>`,
	};

	await sendHelpEmail(help);

	res
		.status(201)
		.json({ message: "request sent to taskpro.project@gmail.com" });
};

export default {
	getAll: ctrlWrapper(getAll),
	getById: ctrlWrapper(getById),
	updateById: ctrlWrapper(updateById),
	deleteById: ctrlWrapper(deleteById),
	addNew: ctrlWrapper(addNew),
	needHelp: ctrlWrapper(needHelp),
};
