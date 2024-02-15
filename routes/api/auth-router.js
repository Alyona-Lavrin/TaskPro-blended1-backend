import express from "express";
import { valBody } from "../../decorators/index.js";
import * as userShemas from '../../models/User.js';
import authController from "../../controllers/auth-controller.js";
import { authenticate, upload } from "../../midelwares/index.js";


const authRouter = express.Router();

const userSignupValidate = valBody(userShemas.userSignupSchema);
const userSigninValidate = valBody(userShemas.userSigninShema);
const userSigninByGoogleValidate = valBody(userShemas.userSigninByGoogleShema);
const userRefreshValidate = valBody(userShemas.userRefreshTokenShema);
const userChangeTheme = valBody(userShemas.userThemeSchema);
const userUpdateValidate = valBody(userShemas.userUpdateShema);


authRouter.post('/signup', userSignupValidate, authController.singup);
authRouter.post('/signin', userSigninValidate, authController.singin);
authRouter.post('/signin-by-google', userSigninByGoogleValidate, authController.singinByGoogle);
authRouter.post('/signout', authenticate, authController.signout);
authRouter.get('/current', authenticate, authController.current);
authRouter.post('/refresh', userRefreshValidate, authController.refresh);
authRouter.put('/users/update', authenticate, userUpdateValidate, authController.updateUser )
authRouter.patch('/users/avatars', authenticate, upload.single('avatar'), authController.updateAvatar);
authRouter.patch('/users/theme', authenticate, userChangeTheme, authController.updateTheme);


export default authRouter;