import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CheckoutComplete from './pages/CheckoutComplete.jsx';
import CustomRequestPage from './pages/CustomRequestPage.jsx';
import { CartProvider } from './CartContext.jsx';

export default function App() {
  const [view, setView] = useState('catalog');
  const [activeProductId, setActiveProductId] = useState(null);
  const [paymentReference, setPaymentReference] = useState(null);

  // Paystack redirects the browser back here with ?reference=... after
  // the customer finishes on their hosted checkout page.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref');
    if (ref) {
      setPaymentReference(ref);
      window.history.replaceState({}, '', '/'); // clean the URL, avoid re-verifying on refresh
    }
  }, []);

  function navigate(nextView, productId = null) {
    setPaymentReference(null);
    setView(nextView);
    if (productId) setActiveProductId(productId);
    window.scrollTo(0, 0);
  }

  return (
    <CartProvider>
      <Header onNavigate={navigate} />

      {paymentReference ? (
        <CheckoutComplete reference={paymentReference} onNavigate={navigate} />
      ) : (
        <>
          {view === 'catalog' && <Catalog onView={(id) => navigate('product', id)} />}
          {view === 'product' && <ProductPage productId={activeProductId} onNavigate={navigate} />}
          {view === 'cart' && <CartPage onNavigate={navigate} />}
          {view === 'checkout' && <CheckoutPage onNavigate={navigate} />}
          {view === 'custom' && <CustomRequestPage onNavigate={navigate} />}
        </>
      )}

      <footer className="site-footer">
        <div className="strip-band" style={{ marginBottom: '20px' }} />
        Fugu Fie — handwoven smocks, delivered across Ghana.
      </footer>
    </CartProvider>
  );
}
