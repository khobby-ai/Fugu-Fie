export default function ProductCard({ product, onView }) {
  const firstImage = product.images?.[0] || product.image;
  return (
    <div className="product-card">
      <div className="thumb">
        {firstImage ? (
          <img
            src={`/products/${firstImage}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
