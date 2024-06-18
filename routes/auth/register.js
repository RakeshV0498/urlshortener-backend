import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { userModel } from "../../db-utils/models.js";
import { transporter } from "../../mail-utils/mail-util.js";

const registerRouter = express.Router();

dotenv.config();

registerRouter.post("/", async (req, res) => {
  const userData = req.body;

  try {
    const userObj = await userModel.findOne({ email: userData.email });

    if (userObj) {
      return res
        .status(404)
        .send({ msg: "User already registered, Please login!", code: -1 });
    }

    bcrypt.hash(userData.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).send({
          msg: "Something went wrong, please try again later",
          code: -2,
        });
      }

      // Create a verification token
      const verificationToken = Math.random().toString(36).substring(7);

      await userModel.create({
        ...userData,
        id: Date.now().toString(),
        password: hash,
        verifyToken: verificationToken,
      });

      const feURL = process.env.FE_URL || "";

      const mailOptions = {
        from: "rockr1204@gmail.com",
        to: userData.email,
        subject: "Account Activation",
        html: `<p>Hello,</p>
              <p>Thank you for registering with us. Please click on the following link to verify your email address:</p>
              <p><a href=${feURL}verify-email/${verificationToken}>Verify Email</a></p>
              <p>If you did not register for this account, please ignore this email.</p>
              <p>Thank you.</p>
              `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ msg: "Error sending email" });
        }
        res.status(200).send({ msg: "Email sent successfully" });
      });

      return res.send({
        msg: "User registered sucessfully. Please verify your email to continue",
      });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ msg: "Something went wrong, Please try again later" });
  }
});

registerRouter.get("/verify-email/:verificationToken", async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const userObj = await userModel.findOne({ verifyToken: verificationToken });

    if (userObj) {
      userObj.active = true;
      userObj.verifyToken = "";
      await userObj.save();
      return res.send({ msg: "Email Verified Successfully" });
    } else {
      return res.status(404).send({ msg: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ msg: "Something went wrong, Please try again later" });
  }
});

export default registerRouter;
