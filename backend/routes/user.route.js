import { Router } from "express";
import { UserSignUp } from "../controllers/auth/signup.js";
import { login } from "../controllers/auth/login.js";

const userRouter=Router()

userRouter.route('/signup').post(UserSignUp)
userRouter.route('/login').post(login)
export default userRouter