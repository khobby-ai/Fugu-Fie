import { useEffect, useState } from 'react';
import { getProducts } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Catalog({ onView }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <section className="hero container">
        <h1>Hand-loomed smocks, strip by strip.</h1>
        <p>
          Every fugu on this site is stitched from narrow, hand-woven cotton strips —
          sourced directly from weavers in the north. Shop the collection, order in
          your size, pay by card or Mobile Money.
        </p>
      </section>
      <div className="strip-divider container" />
      <div className="container">
        {loading ? (
          <p>Loading the collection…</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onView={onView} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
