import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoConnect from "./db-utils/mongoConnect.js";
import registerRouter from "./routes/auth/register.js";
import loginRouter from "./routes/auth/login.js";

const server = express();
const port = 8100;

dotenv.config();

server.use(express.json());

server.use(cors());

mongoConnect();

server.use("/register", registerRouter);
server.use("/login", loginRouter);

server.listen(port, () => {
  console.log(`${Date().toString()} - server listening on port ${port}`);
});
