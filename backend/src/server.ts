import express from "express";
import cookieParser from "cookie-parser";
import LoginRouter from "./router/auth.routes";
import dashboard from "./router/dashboard";
const app = express();
import teamRouter from "./router/teams.routes";
app.use(express.json());
app.use(cookieParser());

app.use("/auth", LoginRouter);
app.use("/dashboard", dashboard);
app.use("/teams", teamRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening On The Port ${PORT}`);
});
