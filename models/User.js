import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";
import Joi from "joi";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const themeList = ["light", "dark", "violet"];

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			match: emailRegexp,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			maxlength: 64,
		},
		accessToken: {
			type: String,
			default: "",
		},
		refreshToken: {
			type: String,
			default: "",
		},
		avatarURL: {
			type: String,
		},
		theme: {
			type: String,
			enum: themeList,
			default: "dark",
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", runValidateAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
	username: Joi.string().min(3).required(),
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(8).max(64).required(),
});

export const userSigninShema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(8).max(64).required(),
});

export const userSigninByGoogleShema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
	username: Joi.string().min(4).max(64).required(),
	avatarUrl: Joi.string()
});

export const userRefreshTokenShema = Joi.object({
	refreshToken: Joi.string().required(),
});

export const userThemeSchema = Joi.object({
	theme: Joi.string()
		.valid(...themeList)
		.required(),
});

export const userUpdateShema = Joi.object({
	username: Joi.string().min(3),
	email: Joi.string().pattern(emailRegexp),
	password: Joi.string().min(8).max(64),
});

const User = model("user", userSchema);
export default User;
