const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const EARLY_BIRD_CUTOFF = new Date("2026-09-30T23:59:59Z");

const PRICES = {
  emerald_prize:   { standard: "price_1TeFfwK0pz60A4vUhhbYlDP1", early: "price_1TeFh9K0pz60A4vU8lEEkYMA" },
  aibfc_portfolio: { standard: "price_1TeFeHK0pz60A4vUQj6b10GT", early: "price_1TeFedK0pz60A4vULjQrnYAp" },
  aibfc_track1:    { standard: "price_1TeFZGK0pz60A4vUULJiucK5", early: "price_1TeFcQK0pz60A4vUTRi5WIUq" },
  aibfc_track2:    { standard: "price_1TeFaKK0pz60A4vUqwDJ4mns", early: "price_1TeFdTK0pz60A4vUp3z5vsYK" }
};

function isEarlyBird() {
  return new Date() <= EARLY_BIRD_CUTOFF;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { school, country, coordinator, email, phone, items } = req.body;

    if (!school || !email || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const lineItems = [];
    const eb = isEarlyBird();

    for (const item of items) {
      const p = PRICES[item.product];
      if (!p) return res.status(400).json({ error: "Invalid product: " + item.product });
      lineItems.push({ price: eb ? p.early : p.standard, quantity: item.quantity });
    }

    const baseUrl = process.env.BASE_URL || "https://emeraldhv.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: baseUrl + "/competitions/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: baseUrl + "/competitions",
      customer_email: email,
      metadata: { school, country, coordinator, phone: phone || "", items: JSON.stringify(items) }
    });

    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
