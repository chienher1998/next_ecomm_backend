import express from "express";
import prisma from "../utils/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;
  const dataId = req.user.id
  //create your validation here
  prisma.nFT
    .create({
      data,
      userId: dataId,
    })
    .then((nFt) => {
      return res.json(nFt);
    });
});

router.get("/", async (req, res) => {
  await prisma.nFT.findMany()
  .then((nFT)=> {
    return res.json(nFT)
  })
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
