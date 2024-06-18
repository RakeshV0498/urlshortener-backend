import express from "express";
import bcrypt from "bcrypt";

import { userModel } from "../../db-utils/models.js";

const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
  const userdata = req.body;

  try {
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

      const mailOptions = {
        from: "rockr1204@gmail.com",
        to: userObj.email,
        subject: "Reset Password",
        html: `<p>Hello,</p>
              <p>Thank you for registering with us. Please click on the following link to verify your email address:</p>
              <p><a href=${feURL}verify-email/>Verify Email</a></p>
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

export default registerRouter;
