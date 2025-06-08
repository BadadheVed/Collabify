import express from "express";
import cookieParser from "cookie-parser";
import LoginRouter from "./router/auth";
import dashboard from "./router/dashboard";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", LoginRouter);
app.use("/dashboard", dashboard);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening On The Port ${PORT}`);
});
