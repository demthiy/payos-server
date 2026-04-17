app.get("/create-payment", async (req, res) => {
  const amount = 10000;
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

    // 👉 redirect luôn để test
    res.redirect(response.data.data.checkoutUrl);

  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});