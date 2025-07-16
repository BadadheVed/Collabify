import { checkAuth } from "../middlewares/roles";
import { login, logout, SignUp } from "../controllers/login.controller";
import { Router } from "express";
import { getAuth } from "@/controllers/user.controller";

const LoginRouter = Router();

LoginRouter.post("/login", login);
LoginRouter.post("/signup", SignUp);
LoginRouter.get("/me", checkAuth, getAuth);
LoginRouter.post("/logout", logout);
export default LoginRouter;
