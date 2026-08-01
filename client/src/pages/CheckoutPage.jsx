import { useState } from 'react';
import { useCart } from '../CartContext.jsx';
import { createOrder, initializePayment } from '../api.js';

export default function CheckoutPage({ onNavigate }) {
  const { items, total } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', country: '' });
  const [deliveryLocation, setDeliveryLocation] = useState('ghana'); // 'ghana' | 'international'
  const [status, setStatus] = useState('idle'); // idle | placing | quote_requested | error
  const [errorMsg, setErrorMsg] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('placing');
    setErrorMsg('');

    try {
      const order = await createOrder({
        customer: form,
        items,
        total,
        deliveryLocation,
      });
      if (order.error) throw new Error(order.error);

      if (deliveryLocation === 'international') {
        // No payment yet — Seidu reviews the order and sends a real
        // shipping quote + Paystack payment link separately.
        setStatus('quote_requested');
        return;
      }

      const payment = await initializePayment({
        email: form.email,
        amountInCedis: total,
        orderId: order.id,
      });
      if (payment.error) throw new Error(payment.error);
      if (!payment.authorization_url) throw new Error('Paystack did not return a checkout link.');

      window.location.href = payment.authorization_url;
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  if (status === 'quote_requested') {
    return (
      <div className="container empty-state">
        <h2>Request received — thank you!</h2>
        <p>
          We'll work out the real shipping cost to {form.country || 'your country'} and send
          you a payment link at {form.email || 'the email you provided'} shortly.
        </p>
        <button className="btn" onClick={() => onNavigate('catalog')}>
          Back to shop
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Nothing to check out.</h2>
        <button className="btn" onClick={() => onNavigate('catalog')}>Browse the collection</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px 0', maxWidth: '520px' }}>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Delivery location</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={`size-chip ${deliveryLocation === 'ghana' ? 'active' : ''}`}
              onClick={() => setDeliveryLocation('ghana')}
            >
              Ghana
            </button>
            <button
              type="button"
              className={`size-chip ${deliveryLocation === 'international' ? 'active' : ''}`}
              onClick={() => setDeliveryLocation('international')}
            >
              International
            </button>
          </div>
        </div>

        <div className="form-row">
          <label>Full name</label>
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Phone (for delivery + Mobile Money if used)</label>
          <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Email (for payment receipt)</label>
          <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>

        {deliveryLocation === 'international' && (
          <div className="form-row">
            <label>Country</label>
            <input required value={form.country} onChange={(e) => update('country', e.target.value)} />
          </div>
        )}

        <div className="form-row">
          <label>{deliveryLocation === 'ghana' ? 'Delivery address' : 'Full delivery address (street, city, postal code)'}</label>
          <textarea required rows={3} value={form.address} onChange={(e) => update('address', e.target.value)} />
        </div>

        <div className="cart-total">
          <span>{deliveryLocation === 'ghana' ? 'Total' : 'Subtotal'}</span>
          <span>GHS {total}</span>
        </div>
        {deliveryLocation === 'international' && (
          <p style={{ color: 'var(--indigo-soft, #5c3d66)', fontSize: '0.9rem', marginTop: '-14px' }}>
            Shipping is quoted separately for international orders — we'll follow up by email
            with the cost and a payment link, no charge yet.
          </p>
        )}

        {errorMsg && <p style={{ color: 'var(--rust)' }}>{errorMsg}</p>}

        <button className="btn" type="submit" disabled={status === 'placing'}>
          {status === 'placing'
            ? 'Submitting…'
            : deliveryLocation === 'ghana'
            ? `Pay GHS ${total}`
            : 'Request shipping quote'}
        </button>
      </form>
    </div>
  );
}
