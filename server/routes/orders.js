import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { notifyWhatsApp } from '../notify.js';

const router = Router();
const DATA_PATH = path.join(process.cwd(), 'data', 'orders.json');

function readOrders() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}
function writeOrders(orders) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(orders, null, 2));
}

router.get('/', (req, res) => {
  res.json(readOrders());
});

router.post('/', (req, res) => {
  const { customer, items, total, deliveryLocation } = req.body;
  if (!customer?.name || !customer?.phone || !items?.length) {
    return res.status(400).json({ error: 'Missing customer info or items' });
  }

  const orders = readOrders();
  const order = {
    id: `ord-${Date.now()}`,
    customer,
    items,
    total,
    deliveryLocation: deliveryLocation || 'ghana',
    status: deliveryLocation === 'international' ? 'quote_requested' : 'pending_payment',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  writeOrders(orders);

  const itemsSummary = items.map((i) => `${i.qty}x ${i.name} (${i.size})`).join(', ');
  if (deliveryLocation === 'international') {
    notifyWhatsApp(
      `🌍 International quote request — ${customer.name} (${customer.phone})\n${itemsSummary}\nSubtotal: GHS ${total}\nCountry: ${customer.country || 'not given'}\nWork out shipping and send them a payment link.`
    );
  } else {
    notifyWhatsApp(
      `🧾 New order started — ${customer.name} (${customer.phone})\n${itemsSummary}\nTotal: GHS ${total}\n(This pings again once payment is confirmed.)`
    );
  }

  res.status(201).json(order);
});

// Called after Paystack confirms payment, to flip the order to paid.
router.patch('/:id/mark-paid', (req, res) => {
  const orders = readOrders();
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = 'paid';
  order.paidAt = new Date().toISOString();
  writeOrders(orders);

  notifyWhatsApp(
    `✅ Payment confirmed — ${order.customer.name} (${order.customer.phone})\nTotal: GHS ${order.total}\nDeliver to: ${order.customer.address}`
  );

  res.json(order);
});

export default router;
