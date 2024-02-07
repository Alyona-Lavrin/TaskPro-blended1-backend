import { Schema, model } from "mongoose";
import MongooseError from "../helpers/MongooseError";

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

columnSchema.post("save", MongooseError);

const Column = model("column", columnSchema);

export default Column;
