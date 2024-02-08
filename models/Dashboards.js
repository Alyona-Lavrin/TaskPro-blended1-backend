import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";
import Joi from "joi";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const dashboardSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Set name for dashboard"],
		},
		icon: {
			type: String,
			default: "",
		},
		backgroundURL: {
			type: String,
			default: null,
		},
		currentDashboard: {
			type: Boolean,
			default: false,
			required: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
	},
	{ versionKey: false, timestamps: true, strictPopulate: false }
);

export const dashboardAddSchema = Joi.object({
	title: Joi.string().required(),
	icon: Joi.string(),
	backgroundURL: Joi.string(),
});

export const needHelpSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
	comment: Joi.string().min(50).required(),
});

dashboardSchema.pre("findOneAndUpdate", runValidateAtUpdate);
dashboardSchema.post("save", handleSaveError);
dashboardSchema.post("findOneAndUpdate", handleSaveError);

const Dashboard = model("dashboard", dashboardSchema);
export default Dashboard;
