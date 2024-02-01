import HttpError from "../helpers/HttpError.js";


const valBody = schema => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(HttpError(400, error.message));
        }
        next()
    }
    return func;
};

export default valBody;