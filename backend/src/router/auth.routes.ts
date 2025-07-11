import { checkAuth } from "@/middlewares/roles";
import { login, SignUp } from "../controllers/login.controller";
import { Router } from "express";
import { getAuth } from "@/controllers/user.controller";

const LoginRouter = Router();

LoginRouter.post("/login", login);
LoginRouter.post("/signup", SignUp);
LoginRouter.post("/me", checkAuth, getAuth);


export default LoginRouter;
