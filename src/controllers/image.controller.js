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

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.nFT
    .findUnique({
      where: {
        id: id,
      },
    })
    .then((nFT) => {
      return res.json(nFT);
    });
});

router.patch("/:id", async (req, res) => {
  const data = req.body;
  const id = parseInt(req.params.id); // Convert id to integer
  const image = await prisma.nFT.findUnique({
    where: {
      id: id,
    },
  });
  if (req.user.payload.id != image.userId) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  await prisma.nFT
    .update({
      where: {
        id: id,
      },
      data,
    })
    .then((nFt) => {
      return res.json(nFt);
    })
    .catch((error) => {
      return res.status(500).json({ error: "Failed to update image" });
    });
});

router.delete("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);
  const image = await prisma.nFT.findUnique({
    where: {
      id: id,
    },
  });

  // we have access to `req.user` from our auth middleware function (see code above where the assignment was made)
  if (req.user.payload.id != image.userId) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  await prisma.nFT
    .delete({
      where: {
        id: id,
      },
    })
    .then((nFt) => {
      return res.json(nFt);
    })
    .catch((error) => {
      return res.status(500).json({ error: "Failed to update image" });
    });
});

export default router;
