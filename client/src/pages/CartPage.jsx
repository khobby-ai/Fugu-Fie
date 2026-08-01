import { useCart } from '../CartContext.jsx';

export default function CartPage({ onNavigate }) {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty.</h2>
        <p>Pick a smock and it'll show up here.</p>
        <button className="btn" onClick={() => onNavigate('catalog')}>
          Browse the collection
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <h1>Your cart</h1>
      {items.map((item) => (
        <div className="cart-line" key={`${item.id}-${item.size}`}>
          <div>
            <strong>{item.name}</strong>
            <div className="meta">Size {item.size}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <input
              className="qty-input"
              type="number"
              min="0"
              value={item.qty}
              onChange={(e) => updateQty(item.id, item.size, parseInt(e.target.value || '0', 10))}
            />
            <span>GHS {item.price * item.qty}</span>
            <button className="btn secondary" onClick={() => removeItem(item.id, item.size)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total">
        <span>Total</span>
        <span>GHS {total}</span>
      </div>

      <button className="btn" onClick={() => onNavigate('checkout')}>
        Proceed to checkout
      </button>
    </div>
  );
}
