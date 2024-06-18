import express from "express";
import { urlModel } from "../db-utils/models.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

const urlRouter = express.Router();

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
  // Get token from headers, query parameters, cookies, or wherever you're sending it from the frontend
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY || "");
    // Attach user object to request
    next(); // Call next middleware
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// Add this to your urlRouter in the backend
urlRouter.get("/", authenticateUser, async (req, res) => {
  try {
    const urls = await urlModel.find();
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

urlRouter.post("/shorten", authenticateUser, async (req, res) => {
  const { longURL } = req.body;

  const shortURL = nanoid(7);
  const id = nanoid(10);

  if (!longURL) {
    res.status(404).send({ msg: "Error Creating short URL, Please try again" });
  }

  try {
    const url = await urlModel.create({ id, longURL, shortURL });
    await url.save();
    return res.send({ shortURL, id, msg: "URL shortned" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Something went wrong, please try again" });
  }
});

urlRouter.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;

  try {
    const url = await urlModel.findOne({ shortURL });
    console.log(url);
    if (url) {
      return res.redirect(url.longURL);
    } else {
      return res.status(404).json({ error: "Short URL not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Dashboard route to get URL counts
urlRouter.get("/dashboard", authenticateUser, async (req, res) => {
  try {
    const user = req.user; // Assuming user object is available in req after authentication
    const currentDate = new Date();
    const startDateOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const urlsCreatedToday = await urlModel.countDocuments({
      createdBy: user.email,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const urlsCreatedThisMonth = await urlModel.countDocuments({
      createdBy: user.email,
      createdAt: { $gte: startDateOfMonth },
    });

    res.status(200).json({ urlsCreatedToday, urlsCreatedThisMonth });
  } catch (error) {
    console.error("Error fetching URL counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default urlRouter;
