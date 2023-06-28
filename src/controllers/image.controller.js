import express from "express";
import prisma from "../utils/prisma.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const databody = req.body;
  const dataId = req.user.payload.id; // passed from auth
  const dataName = req.user.payload.name;
  const data = { ...databody, userId: dataId, userName: dataName }; // spread operator joins the other object together

  prisma.nFT
    .create({
      data,
    })
    .then((nFt) => {
      return res.json(nFt);
    });
});

router.get("/", async (req, res) => {
  const id = +req.query.users; // + is shorthand of parseInt
  let result;

  if (id) {
    result = await prisma.nFT.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } else {
    result = await prisma.nFT.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  return res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = +req.params.id;
  prisma.nFT
    .findUnique({
      where: {
        id: id,
      },
    })
    .then((nFT) => {
      return res.json(nFT);
    });
});

router.patch("/:id", auth, async (req, res) => {
  const data = req.body;
  const id = +req.params.id; // Convert id to integer
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
    .then((nFT) => {
      //then = await
      return res.json(nFT);
    })
    .catch((error) => {
      return res.status(500).json({ error: "Failed to update image" });
    });
});

router.delete("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const image = await prisma.nFT.findUnique({
    where: {
      id: id,
    },
  });

  console.log(image);

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
    .then(() => {
      return res.json({ message: "Image has been deleted" });
    })
    .catch((error) => {
      return res.status(500).json({ error: "Failed to delete image" });
    });
});

export default router;
