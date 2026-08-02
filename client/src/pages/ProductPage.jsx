import { useEffect, useState } from 'react';
import { getProduct } from '../api.js';
import { useCart } from '../CartContext.jsx';

export default function ProductPage({ productId, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    setAdded(false);
    setSelectedImage(0);
    getProduct(productId).then((data) => {
      setProduct(data);
      setSize(data.sizes?.[0] ?? null);
    });
  }, [productId]);

  if (!product) return <div className="container"><p>Loading…</p></div>;

  // Supports the new multi-photo "images" array, and still works with
  // older products that only have a single "image" field.
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return (
    <div className="container product-page">
      <div>
        <div className="thumb-large">
          {images.length ? (
            <img
              src={`/products/${images[selectedImage]}`}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            product.name
          )}
        </div>
        {images.length > 1 && (
          <div className="thumb-gallery">
            {images.map((img, i) => (
              <button
                key={img}
                className={`thumb-chip ${i === selectedImage ? 'active' : ''}`}
                onClick={() => setSelectedImage(i)}
              >
                <img src={`/products/${img}`} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
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
