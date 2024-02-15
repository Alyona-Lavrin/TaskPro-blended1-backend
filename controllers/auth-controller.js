import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import cloudinary from '../helpers/cloudinary.js';

const { SECRET_KEY } = process.env;


const singup = async (req, res) => {
    const { email, password, _id, username, theme } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email in use')
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = '';
    
    const newUser = User.create({ ...req.body, username: username, password: hashPassword, avatarURL });
    
    res.status(201).json({
        user: {
            username: (await newUser).username,
            email: (await newUser).email,
            avatarURL: (await newUser).avatarURL,
            id: (await newUser)._id,
            theme: (await newUser).theme,
        },
        
    })
};

const singinByGoogle = async(req, res) => {
    const { email, username, avatarUrl: avatarURL} = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        const newPassword = Math.random().toString(36).slice(-8);
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await User.create({ 
            username: username, 
            password: hashPassword, 
            avatarURL,
            email: email,
            theme: "dark",
         });
         user = await User.findOne({ email });
    }
    const payload = {
        id: user._id
    }
    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '5d' });
    const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
    await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

    res.json({
        accessToken,
        refreshToken,
        user: { username: user.username, email: email, avatarURL: user.avatarURL, theme: user.theme, id: user._id }
    })
};

const singin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password invalid')
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Email or password invalid');
    }
    const payload = {
        id: user._id
    }
    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '5d' });
    const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
    await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

    res.json({
        accessToken,
        refreshToken,
        user: { username: user.username, email: email, avatarURL: user.avatarURL, theme: user.theme, id: user._id }
    })
};

const current = async (req, res) => {
    const { username, email, avatarURL, theme, _id } = req.user;

    res.json({
        username,
        email,
        avatarURL,
        theme,
        _id,
    })
};

const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });

    res.json({
        message: "Signout success"
    })
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { url } = await cloudinary.uploader.upload(req.file.path, { folder: 'avatars' });
    const avatarURL = url;
    await User.findByIdAndUpdate(_id, { avatarURL });
    await fs.unlink(req.file.path);

    res.json({
        avatarURL,
    })
};

const refresh = async (req, res) => {
    const { refreshToken: token } = req.body;
    console.log(token)
    
    const { id } = jwt.verify(token, SECRET_KEY);
    console.log(id)
        const user = await User.findById(id);
        if (!user) {
            throw HttpError(403)
        }
        const payload = {
            id,
        }
        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "5d" });
        const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
        await User.findByIdAndUpdate(id, { accessToken, refreshToken });

        res.json({
            accessToken,
            refreshToken,
        })
    
    
};

const updateTheme = async (req, res) => {
    const { theme } = req.body;
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, { theme }, { new: true });
    res.json(result)
};

const updateUser = async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    
    if (password) {
        const hashPassword = await bcrypt.hash(password, 10);
        req.body.password = hashPassword;
    }
    const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
    res.json({
            username: result.username,
            email: result.email,
            avatarURL: result.avatarURL,
            id: _id,
    })
}



export default {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
    singinByGoogle: ctrlWrapper(singinByGoogle),
    signout: ctrlWrapper(signout),
    current: ctrlWrapper(current),
    refresh: ctrlWrapper(refresh),
    updateUser: ctrlWrapper(updateUser),
    updateAvatar: ctrlWrapper(updateAvatar),
    updateTheme: ctrlWrapper(updateTheme),
}