import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  res.json(products);
});

router.get('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

export default router;
