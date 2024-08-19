require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: "Laptop Dell enspiron",
          },
          unit_amount: 5000 * 100,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: "IPhone 14 Pro max",
          },
          unit_amount: 3000 * 100,
        },
        quantity: 2,
      },
    ],
    mode: "payment",
    // shipping_address_collection: {
    //   allowed_countries: ["EG", "SA"],
    // },
    success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
  });

  res.redirect(session.url);
});

app.get("/complete", async (req, res) => {
  const result = Promise.all([
    // IT WILL SHOW THE PAYMENT'S CLIENT DETAILS
    stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ["payment_intent.payment_method"],
    }),
    // THIS WILL GIVE US THE DETAILS OF THE PRODUCTS NAMES AND THE ITEMS AND LAST 4 DIGITS FROM VISA
    stripe.checkout.sessions.listLineItems(req.query.session_id),
  ]);

  console.log(JSON.stringify(await result));

  res.send("Your Payment Was Successful");
});

app.get("/cancel", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => console.log("server is running on port 3000"));
