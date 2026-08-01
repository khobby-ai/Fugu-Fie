const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  return res.json();
}

export async function initializePayment({ email, amountInCedis, orderId }) {
  const res = await fetch(`${API_BASE}/payment/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amountInCedis, orderId }),
  });
  return res.json();
}

export async function verifyPayment(reference) {
  const res = await fetch(`${API_BASE}/payment/verify/${reference}`);
  return res.json();
}

export async function markOrderPaid(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/mark-paid`, { method: 'PATCH' });
  return res.json();
}

export async function submitCustomRequest({ name, phone, description }) {
  const res = await fetch(`${API_BASE}/custom-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, description }),
  });
  return res.json();
}
