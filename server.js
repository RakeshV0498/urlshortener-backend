import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoConnect from "./db-utils/mongoConnect.js";
import registerRouter from "./routes/auth/register.js";
import loginRouter from "./routes/auth/login.js";
import forgotPassRouter from "./routes/auth/forgotPassword.js";
import resetPassRouter from "./routes/auth/resetPassword.js";

const server = express();
const port = 8100;

dotenv.config();

server.use(express.json());

server.use(cors());

mongoConnect();

server.use("/register", registerRouter);
server.use("/login", loginRouter);
server.use("/forgot-password", forgotPassRouter);
server.use("/reset-password", resetPassRouter);

server.listen(port, () => {
  console.log(`${Date().toString()} - server listening on port ${port}`);
});
