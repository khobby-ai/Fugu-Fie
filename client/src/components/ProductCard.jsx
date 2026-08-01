export default function ProductCard({ product, onView }) {
  return (
    <div className="product-card">
      <div className="thumb">
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
      <div className="info">
        <h3>{product.name}</h3>
        <div className="price">GHS {product.price}</div>
        <button className="btn secondary" onClick={() => onView(product.id)}>
          View
        </button>
      </div>
    </div>
  );
}
