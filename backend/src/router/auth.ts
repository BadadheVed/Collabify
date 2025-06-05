import { login, SignUp } from "../controllers/login.controller";
import { Router } from "express";

const LoginRouter = Router();

LoginRouter.post("/login", login);
LoginRouter.post("/signup", SignUp);

export default LoginRouter;
