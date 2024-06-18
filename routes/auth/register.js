import express from "express";
import bcrypt from "bcrypt";

import { userModel } from "../../db-utils/models.js";

const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
  const userdata = req.body;

  const userObj = await userModel.findOne({ email: userdata.email });

  if (userObj) {
    return res
      .status(404)
      .send({ msg: "User already registered, Please login!", code: -1 });
  }

  bcrypt.hash(userdata.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).send({
        msg: "Something went wrong, please try again later",
        code: -2,
      });
    }
    await userModel.create({
      ...userdata,
      id: Date.now().toString(),
      password: hash,
    });

    return res.send({
      msg: "User registered sucessfully. Please verify your email to continue",
    });
  });
});

export default registerRouter;
