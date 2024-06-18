import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import mongoConnect from "./db-utils/mongoConnect.js";
import registerRouter from "./routes/auth/register.js";
import loginRouter from "./routes/auth/login.js";
import forgotPassRouter from "./routes/auth/forgotPassword.js";
import resetPassRouter from "./routes/auth/resetPassword.js";
import urlRouter from "./routes/urlShort.js";

const server = express();
const port = 8100;

dotenv.config();

server.use(express.json());

server.use(cors());

mongoConnect();

// Middleware to verify JWT token
export const authenticateUser = (req, res, next) => {
  // Get token from headers, query parameters, cookies, or wherever you're sending it from the frontend
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY || "");
    console.log(decoded);
    // Attach user object to request
    next(); // Call next middleware
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

server.use("/register", registerRouter);
server.use("/login", loginRouter);
server.use("/forgot-password", forgotPassRouter);
server.use("/reset-password", resetPassRouter);
server.use("/urls", urlRouter);

server.listen(port, () => {
  console.log(`${Date().toString()} - server listening on port ${port}`);
});
