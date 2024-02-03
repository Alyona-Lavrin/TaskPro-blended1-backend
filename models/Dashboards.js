import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks.js";
import Joi from "joi";

const dashboardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    backgroundURL: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: "",
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

const dashboardAddSchema = Joi.object({
  title: Joi.string().required(),
  icon: Joi.string(),
  background: Joi.string(),
});
dashboardSchema.post("save", handleSaveError);

const Dashboard = model("dashboard", dashboardSchema);
export default Dashboard;
