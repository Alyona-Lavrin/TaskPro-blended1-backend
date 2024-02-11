import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const priorityList = ["gray", "green", "blue", "pink"];

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for card"],
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      enum: priorityList,
      default: "gray",
    },
    deadline: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "column",
      required: [true, "Set column for card"],
    },
  },
  { versionKey: false, timestamps: true }
);

export const cardAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": `missing required "title" field`,
  }),
  description: Joi.string(),
  color: Joi.string().valid(...priorityList),
  deadline: Joi.string(),
  
});
export const cardUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  color: Joi.string().valid(...priorityList),
  deadline: Joi.string(),
});


cardSchema.pre("findOneAndUpdate", runValidateAtUpdate);
cardSchema.post("save", handleSaveError);
cardSchema.post("findOneAndUpdate", handleSaveError);

export const Card = model("card", cardSchema);
