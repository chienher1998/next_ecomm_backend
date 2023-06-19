import express from "express";
import prisma from "../utils/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;
  //create your validation here
  prisma.nFT.create({
    data,
  }).then(nFt => {
    return res.json(nFt);
  });
});

router.get("/", async (req,res) => {
  
})