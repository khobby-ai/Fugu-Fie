import { useEffect, useState } from 'react';
import { getProduct } from '../api.js';
import { useCart } from '../CartContext.jsx';

export default function ProductPage({ productId, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setAdded(false);
    getProduct(productId).then((data) => {
      setProduct(data);
      setSize(data.sizes?.[0] ?? null);
    });
  }, [productId]);

  if (!product) return <div className="container"><p>Loading…</p></div>;

  return (
    <div className="container product-page">
      <div className="thumb-large">
        {product.image ? (
          <img
            src={`/products/${product.image}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          product.name
        )}
      </div>
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="price" style={{ fontSize: '1.3rem', margin: '12px 0' }}>
          GHS {product.price}
        </div>

        <div>
          <strong>Size</strong>
          <div className="size-options">
            {product.sizes.map((s) => (
              <button
                key={s}
                className={`size-chip ${size === s ? 'active' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn"
          onClick={() => {
            addItem(product, size, 1);
            setAdded(true);
          }}
        >
          Add to cart
        </button>

        {added && (
          <p style={{ marginTop: '14px' }}>
            Added to cart.{' '}
            <a href="#" onClick={() => onNavigate('cart')} style={{ textDecoration: 'underline' }}>
              Go to cart
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
