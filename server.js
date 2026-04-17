const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

const app = express();
app.use(express.json());

const CLIENT_ID = "71a557cd-427c-4d73-ba59-be6790216bb1";
const API_KEY = "1ffddd58-bb67-46cc-bbb3-0f5b9385f1b3";
const CHECKSUM_KEY = "e6dcf6ea97ac6b85dc861115d3c17df3bdb838bcb7b64be6246d5d4cb2cae9a5";

app.post("/create-payment", async (req, res) => {
  const { amount } = req.body;

  const orderCode = Date.now();

  const data = {
    orderCode,
    amount,
    description: "Nap tien",
    returnUrl: "https://project1542.bubbleapps.io/success",
    cancelUrl: "https://project1542.bubbleapps.io/cancel"
  };

  // tạo chuỗi để ký
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));