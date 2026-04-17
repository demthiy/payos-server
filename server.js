const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

const app = express();
app.use(express.json());

const CLIENT_ID = "YOUR_CLIENT_ID";
const API_KEY = "YOUR_API_KEY";
const CHECKSUM_KEY = "YOUR_CHECKSUM_KEY";

app.post("/create-payment", async (req, res) => {
  const { amount } = req.body;
  const orderCode = Date.now();

  const data = {
    orderCode,
    amount,
    description: "Nap tien",
    returnUrl: `https://payos-server-d2vr.onrender.com/success`,
    cancelUrl: "https://project1542.bubbleapps.io/cancel"
  };

  const rawData = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${data.orderCode}&returnUrl=${data.returnUrl}`;

  const signature = crypto
    .createHmac("sha256", CHECKSUM_KEY)
    .update(rawData)
    .digest("hex");

  try {
    const response = await axios.post(
      "https://api-merchant.payos.vn/v2/payment-requests",
      {
        ...data,
        signature
      },
      {
        headers: {
          "x-client-id": CLIENT_ID,
          "x-api-key": API_KEY
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});

// ✅ thêm đoạn này
app.get('/success', (req, res) => {
  const { orderCode } = req.query;

  res.redirect(`https://project1542.bubbleapps.io/success?amount=${amount}&orderCode=${orderCode}`);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));