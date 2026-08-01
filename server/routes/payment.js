import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();
const PAYSTACK_BASE = 'https://api.paystack.co';

// Starts a transaction. Amount must be in the smallest currency unit
// (pesewas for GHS), so multiply cedis by 100.
router.post('/initialize', async (req, res) => {
  const { email, amountInCedis, orderId } = req.body;
  if (!email || !amountInCedis || !orderId) {
    return res.status(400).json({ error: 'Missing email, amountInCedis, or orderId' });
  }

  try {
    const psRes = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amountInCedis * 100),
        currency: 'GHS',
        metadata: { orderId },
        callback_url: `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/checkout-complete`,
      }),
    });
    const data = await psRes.json();
    if (!data.status) return res.status(400).json({ error: data.message });
    res.json(data.data); // { authorization_url, access_code, reference }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verifies a transaction reference server-side before trusting it.
// Always verify on the backend — never mark an order paid from client input alone.
router.get('/verify/:reference', async (req, res) => {
  try {
    const psRes = await fetch(`${PAYSTACK_BASE}/transaction/verify/${req.params.reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await psRes.json();
    if (!data.status) return res.status(400).json({ error: data.message });
    res.json({ verified: data.data.status === 'success', data: data.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
