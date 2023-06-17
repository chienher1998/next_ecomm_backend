import express from "express";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { validateUser } from "../validators/users.js";
import { filter } from "../utils/common.js";
// import sgMail from "@sendgrid/mail";

const router = express.Router();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async (req, res) => {
  const data = req.body;
  // const msg = {
  //   to: "clement.ch90@gmail.com", // Change to your recipient
  //   from: "clement.ch90@gmail.com", // Change to your verified sender
  //   subject: "Sending with SendGrid is Fun",
  //   text: "U DUMB and easy to do anywhere, even with Node.js",
  //   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  // };

  const validationErrors = validateUser(data);

  if (Object.keys(validationErrors).length != 0)
    return res.status(400).send({
      error: validationErrors,
    });

  data.password = bcrypt.hashSync(data.password, 8);

  prisma.user
    .create({
      data,
    })
    .then((user) => {
      // sgMail
      //   .send(msg)
      //   .then((response) => {
      //     console.log(response[0].statusCode);
      //     console.log(response[0].headers);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });

      return res.json(filter(user, "id", "username", "email"));
    })
    .catch((err) => {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        const formattedError = {};
        formattedError[`${err.meta.target[0]}`] = "Email already taken";

        return res.status(500).send({
          error: formattedError,
        });
      }
      throw err;
    });
});

export default router;
