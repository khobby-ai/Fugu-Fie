import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('smock-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('smock-cart', JSON.stringify(items));
  }, [items]);

  function addItem(product, size, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === size ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, size, qty }];
    });
  }

  function updateQty(id, size, qty) {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.id === id && i.size === size))
        : prev.map((i) => (i.id === id && i.size === size ? { ...i, qty } : i))
    );
  }

  function removeItem(id, size) {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
