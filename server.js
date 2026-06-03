const express = require("express");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Early bird cutoff — 30 Sept 2026
const EARLY_BIRD_CUTOFF = new Date("2026-09-30T23:59:59Z");

const PRICES = {
  emerald_prize:        { standard: "price_1TeFfwK0pz60A4vUhhbYlDP1", early: "price_1TeFh9K0pz60A4vU8lEEkYMA" },
  aibfc_portfolio:      { standard: "price_1TeFeHK0pz60A4vUQj6b10GT", early: "price_1TeFedK0pz60A4vULjQrnYAp" },
  aibfc_track1:         { standard: "price_1TeFZGK0pz60A4vUULJiucK5", early: "price_1TeFcQK0pz60A4vUTRi5WIUq" },
  aibfc_track2:         { standard: "price_1TeFaKK0pz60A4vUqwDJ4mns", early: "price_1TeFdTK0pz60A4vUp3z5vsYK" }
};

function isEarlyBird() {
  return new Date() <= EARLY_BIRD_CUTOFF;
}

function getPrice(product) {
  const p = PRICES[product];
  if (!p) return null;
  return isEarlyBird() ? p.early : p.standard;
}

// ── Routes ──────────────────────────────────────────
app.get("/tour", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "tour.html"));
});

app.get("/competitions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "competitions.html"));
});

app.get("/competitions/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

app.get("/competitions/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "competitions.html"));
});

// ── Early bird status API ────────────────────────────
app.get("/api/pricing", (req, res) => {
  res.json({ earlyBird: isEarlyBird(), cutoff: EARLY_BIRD_CUTOFF });
});

// ── Stripe Checkout ──────────────────────────────────
app.post("/api/checkout", async (req, res) => {
  try {
    const { school, country, coordinator, email, phone, items } = req.body;

    if (!school || !email || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const lineItems = [];

    for (const item of items) {
      const priceId = getPrice(item.product);
      if (!priceId) return res.status(400).json({ error: "Invalid product: " + item.product });
      lineItems.push({ price: priceId, quantity: item.quantity });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: process.env.BASE_URL + "/competitions/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: process.env.BASE_URL + "/competitions",
      customer_email: email,
      metadata: {
        school,
        country,
        coordinator,
        phone: phone || "",
        items: JSON.stringify(items)
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Catch-all ────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Emerald Horizon Ventures running on port " + PORT);
});
