import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import paymentRouter from './routes/payment.js';
import customRequestsRouter from './routes/customRequests.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/custom-requests', customRequestsRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
console.log('Paystack secret key loaded:', process.env.PAYSTACK_SECRET_KEY ? process.env.PAYSTACK_SECRET_KEY.slice(0, 8) + '...' : 'MISSING — .env not being read');
app.listen(PORT, () => console.log(`Smock store API running on http://localhost:${PORT}`));
