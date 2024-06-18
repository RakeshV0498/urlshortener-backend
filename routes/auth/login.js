import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { userModel } from "../../db-utils/models.js";

const loginRouter = express.Router();

dotenv.config();

loginRouter.post("/", async (req, res) => {
  const userData = req.body;

  const userObj = await userModel.findOne({ email: userData.email });

  if (userObj) {
    if (!userObj.active) {
      return res
        .status(404)
        .send({
          msg: "Please verify your email to activate your account. Email alreay sent!",
        });
    }

    const password = userData.password;

    bcrypt.compare(password, userObj.password, async (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ msg: "Something went wrong, Please try again later" });
      }
      if (result) {
        const { id, email, firstName, lastName, active } = userObj;

        const token = jwt.sign(
          { id, email, firstName, lastName, active },
          process.env.JWT_SECRETKEY,
          {
            expiresIn: "1d",
          }
        );

        return res
          .status(200)
          .send({ msg: "User Successfully logged in", code: 1, user: token });
      } else {
        return res
          .status(400)
          .send({ msg: "User Credentials failed", code: 0 });
      }
    });
  } else {
    return res
      .status(404)
      .send({ msg: "User not found, Please register", code: -2 });
  }
});

export default loginRouter;
