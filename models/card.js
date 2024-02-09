import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const priorityList = ["gray", "green", "blue", "pink"];
const deadlineRegex =
  /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

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
      // match: deadlineRegex,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "column",
      required: [true, "Set column for card"],
    },
    // orderNumder: {
    //   type: Number,
    // },
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
  priority: Joi.string().valid(...priorityList),
  deadline: Joi.string().pattern(deadlineRegex),
});
export const cardTransportSchema = Joi.object({
  source: Joi.string().required().messages({
    "any.required": `missing required "source" field`,
  }),
  destination: Joi.string().required().messages({
    "any.required": `missing required "destination" field`,
  }),
});

cardSchema.pre("findOneAndUpdate", runValidateAtUpdate);
cardSchema.post("save", handleSaveError);
cardSchema.post("findOneAndUpdate", handleSaveError);

export const Card = model("card", cardSchema);
