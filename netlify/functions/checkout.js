const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const EARLY_BIRD_CUTOFF = new Date("2026-09-30T23:59:59Z");

const PRICES = {
  emerald_prize:   { standard: "price_1TeFfwK0pz60A4vUhhbYlDP1", early: "price_1TeFh9K0pz60A4vU8lEEkYMA" },
  aibfc_portfolio: { standard: "price_1TeFeHK0pz60A4vUQj6b10GT", early: "price_1TeFedK0pz60A4vULjQrnYAp" },
  aibfc_track1:    { standard: "price_1TeFZGK0pz60A4vUULJiucK5", early: "price_1TeFcQK0pz60A4vUTRi5WIUq" },
  aibfc_track2:    { standard: "price_1TeFaKK0pz60A4vUqwDJ4mns", early: "price_1TeFdTK0pz60A4vUp3z5vsYK" }
};

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { school, country, coordinator, email, phone, items } = JSON.parse(event.body);

    if (!school || !email || !items || items.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const earlyBird = new Date() <= EARLY_BIRD_CUTOFF;
    const lineItems = [];

    for (const item of items) {
      const p = PRICES[item.product];
      if (!p) return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid product: " + item.product }) };
      lineItems.push({ price: earlyBird ? p.early : p.standard, quantity: item.quantity });
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

    return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };

  } catch (err) {
    console.error("Stripe error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
