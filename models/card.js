import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks";


const priorityList = ["without priority", "low", "medium", "high"];
const deadlineRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

const cardSchema = new Schema({
    title: {
        type: String,
        required: [tru, "Set title for card"],
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: priorityList,
        default: "without priority",
    },
    deadline: {
        type: String,
        match: deadlineRegex,
    },
    column: {
        type: Schema.Types.ObjectId,
        ref: "column",
        required: [true, 'Set column for card'],
    },
    orderNumder: {
        type: Number,
    },
}, { versionKey: false, timestamps: true });

const cardAddSchema = Joi.object({
    title: Joi.string().required()
        .messages({
            "any.required": `missing required "title" field`,
        }),
    description: Joi.string(),
    priority: Joi.string().valid(...priorityList),
    deadline: Joi.string().pattern(deadlineRegex),
    column: Joi.string().required()
        .messages({
            "any.required": `missing required "column" field`,
        }),
});
const cardUpdateSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    priority: Joi.string().valid(...priorityList),
    deadline: Joi.string().pattern(deadlineRegex),
});
const cardTransportSchema = Joi.object({
    source: Joi.string().required()
        .messages({
            "any.required": `missing required "source" field`,
        }),
    destination: Joi.string().required()
        .messages({
            "any.required": `missing required "destination" field`,
        }),
})


cardSchema.pre("findOneAndUpdate", runValidateAtUpdate);
cardSchema.post("save", handleSaveError);
cardSchema.post("findOneAndUpdate", handleSaveError);

const Card = model('card', cardSchema);

export default {
    cardAddSchema,
    cardUpdateSchema,
    cardTransportSchema,
    Card
};