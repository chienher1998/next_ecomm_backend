import express from "express";
import prisma from "../utils/prisma.js";
// import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/all/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.nFT
      .findMany({
        where: {
          userId: id,
        },
      })
      .then((nFT) => {
        return res.json(nFT);
      });
  });

  router.get("/unique/:id", async (req, res) => {
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
  
export default router;