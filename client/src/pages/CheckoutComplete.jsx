import { useEffect, useState } from 'react';
import { useCart } from '../CartContext.jsx';
import { verifyPayment, markOrderPaid } from '../api.js';

export default function CheckoutComplete({ reference, onNavigate }) {
  const { clearCart } = useCart();
  const [status, setStatus] = useState('checking'); // checking | success | failed

  useEffect(() => {
    verifyPayment(reference).then(async (result) => {
      if (result.verified) {
        const orderId = result.data?.metadata?.orderId;
        if (orderId) await markOrderPaid(orderId);
        clearCart();
        setStatus('success');
      } else {
        setStatus('failed');
      }
    });
  }, [reference]);

  if (status === 'checking') {
    return (
      <div className="container empty-state">
        <h2>Confirming your payment…</h2>
        <p>Give this a moment, don't close the tab.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container empty-state">
        <h2>We couldn't confirm this payment.</h2>
        <p>If you were charged, contact us with this reference: {reference}</p>
        <button className="btn" onClick={() => onNavigate('catalog')}>
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="container empty-state">
      <h2>Order confirmed — thank you!</h2>
      <p>We'll reach out shortly to arrange delivery.</p>
      <button className="btn" onClick={() => onNavigate('catalog')}>
        Back to shop
      </button>
    </div>
  );
}
