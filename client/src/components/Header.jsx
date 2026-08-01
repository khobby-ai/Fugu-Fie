import { useCart } from '../CartContext.jsx';

export default function Header({ onNavigate }) {
  const { count } = useCart();
  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" onClick={() => onNavigate('catalog')} href="#">
          Fugu <span>Fie</span>
        </a>
        <nav className="nav-links">
          <a href="#" onClick={() => onNavigate('catalog')}>Shop</a>
          <a href="#" onClick={() => onNavigate('custom')}>Custom Request</a>
          <a href="#" onClick={() => onNavigate('cart')} className="cart-pill">
            Cart ({count})
          </a>
        </nav>
      </div>
      <div className="strip-band" />
    </header>
  );
}
