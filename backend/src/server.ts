import express from "express";
import cookieParser from "cookie-parser";
import LoginRouter from "./router/auth";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", LoginRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening On The Port ${PORT}`);
});
