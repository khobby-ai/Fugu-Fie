import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { notifyOwner } from '../notify.js';

const router = Router();
const DATA_PATH = path.join(process.cwd(), 'data', 'custom-requests.json');

function readRequests() {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}
function writeRequests(requests) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(requests, null, 2));
}

router.post('/', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing name or phone' });
  }

  const requests = readRequests();
  const request = {
    id: `req-${Date.now()}`,
    name,
    phone,
    createdAt: new Date().toISOString(),
  };
  requests.push(request);
  writeRequests(requests);

  notifyOwner(
    '📸 Custom smock request — Fugu Fie',
    `${name} (${phone})\nThey were sent to WhatsApp directly with a reference photo — check your chats and talk through what they need.`
  );

  res.status(201).json(request);
});

export default router;
