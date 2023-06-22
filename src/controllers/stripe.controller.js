import Stripe from "stripe";
import express from "express";
import prisma from "../utils/prisma.js";
import axios from "axios";
const stripe = new Stripe(
  "sk_test_51NLL4zLuItmOXGtPgtQstCbiAwq2JguYSHPmW4TaqZsN3a5BFZj1kPVMc7B30m9bWHLiyEQUJ3qNyDSkNs2mOtwr00fqwJKR6u"
);

const YOUR_DOMAIN = "http://localhost:5173";
const router = express.Router();

router.post("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const image = await prisma.nFT.findUnique({
    where: {
      id: id,
    },
  });

  async function getEthToUsdRate() {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const ethToUsdRate = response.data.ethereum.usd;
      const ethAmount = image.price;
      const res = ethAmount * ethToUsdRate;
      return res.toFixed(2);
    } catch (error) {
      console.error("Error fetching ETH to USD rate:", error);
      throw error;
    }
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: image.title,
            images: [image.imageFile]
          },
          unit_amount: Math.round((await getEthToUsdRate()) * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/`,
  });

  res.json(session.url);
});

export default router;
