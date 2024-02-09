import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";
import Joi from "joi";

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "dashboard",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const columnAddSchema = Joi.object({
  title: Joi.string().required(),
});

columnSchema.pre("findOneAndUpdate", runValidateAtUpdate);
columnSchema.post("save", handleSaveError);
columnSchema.post("findOneAndUpdate", handleSaveError);

const Column = model("column", columnSchema);

export default Column;
