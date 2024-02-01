import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, accessToken] = authorization.split(" ");
    if (bearer !== "Bearer") {
        next(HttpError(401));
    }
    try {
        const { id } = jwt.verify(accessToken, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.accessToken || user.accessToken !== accessToken) {
            return next(HttpError(401));
        }
        req.user = user;
        next();
    }
    catch {
        next (HttpError(401));
    }
};

export default authenticate;