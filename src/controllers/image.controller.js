import express from "express";
import prisma from "../utils/prisma.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const databody = req.body;
  const dataId = req.user.payload.id; // passed from auth
  const dataName = req.user.payload.name;
  const data = { ...databody, userId: dataId, userName: dataName }; // spread operator joins the other object together

  //create your validation here

  prisma.nFT
    .create({
      data,
    })
    .then((nFt) => {
      return res.json(nFt);
    });
});

router.get("/", async (req, res) => {
  await prisma.nFT.findMany().then((nFT) => {
    return res.json(nFT);
  });
});

router.delete("/:id", async (req, res) => {
  const image = await prisma.image.findUnique({
    where: {
      id: req.params.id,
    },
  });

  // we have access to `req.user` from our auth middleware function (see code above where the assignment was made)
  if (req.user.id != image.user_id) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  await prisma.nFT.delete({
    where: {
      id: req.params.id,
    },
  });
});

export default router;
