import Stripe from "stripe";
import express from "express";
import prisma from "../utils/prisma.js";
import axios from "axios";
import auth from "../middlewares/auth.js";
const stripe = new Stripe(process.env.STRIPE_SECRET);

const YOUR_DOMAIN = "http://localhost:5173";
const router = express.Router();

router.post("/:id", auth, async (req, res) => {
  const id = +req.params.id;
  const image = await prisma.nFT.findUnique({
    where: {
      id: id,
    },
  });

  if (req.user.payload.id != image.userId) {
    return res.status(401).send({ error: "Unauthorized" });
  }

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
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: image.title,
            images: [image.imageFile],
          },
          unit_amount: Math.round((await getEthToUsdRate()) * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/NFT/${id}`,
  });

  res.json(session.url);
});

export default router;
