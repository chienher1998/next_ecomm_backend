import Stripe from "stripe";
import express from "express";
import prisma from "../utils/prisma.js";
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
  })

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: image.title,
          },
          unit_amount: image.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

export default router;
