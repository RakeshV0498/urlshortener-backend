import express from "express";
import { urlModel } from "../db-utils/models.js";
import { nanoid } from "nanoid";

const urlRouter = express.Router();

urlRouter.post("/shorten", async (req, res) => {
  const { longURL } = req.body;

  const shortURL = nanoid(7);
  const id = nanoid(10);

  try {
    const url = await urlModel.create({ id, longURL, shortURL });
    await url.save();
    return res.send({ shortURL, id, msg: "URL shortned" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error Creating short URL" });
  }
});

urlRouter.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;
  console.log(shortURL);
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

export default urlRouter;
