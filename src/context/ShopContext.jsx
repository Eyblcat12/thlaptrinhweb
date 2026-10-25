import { useEffect, useRef, useState } from 'react';
import { addItem, CART_KEY, readCart } from '../lib/cart';
import { ShopContext } from './shop';

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(readCart);
  const [toast, setToast] = useState('');
  const [coupon, setCoupon] = useState(() => {
    try {
      return sessionStorage.getItem('nova-coupon') === 'NOVA10' ? 'NOVA10' : '';
    } catch {
      return '';
    }
  });
  const timeout = useRef();
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* Trình duyệt có thể chặn lưu trữ. */
    }
  }, [cart]);
  useEffect(() => {
    try {
      sessionStorage.setItem('nova-coupon', coupon);
    } catch {
      /* Giữ mã trong bộ nhớ nếu trình duyệt chặn lưu trữ. */
    }
  }, [coupon]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function notify(message) {
    clearTimeout(timeout.current);
    setToast(message);
    timeout.current = setTimeout(() => setToast(''), 3200);
  }
  function addToCart(id) {
    const existing = cart.find((item) => item.id === id);
    if (existing?.quantity >= 10) {
      notify('Tối đa 10 sản phẩm mỗi loại trong đơn hàng.');
      return;
    }
    setCart((current) => addItem(current, id));
    notify('Đã thêm sản phẩm vào giỏ hàng!');
  }
  function setQuantity(id, quantity) {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(10, quantity) } : item,
          ),
    );
  }
  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        setQuantity,
        coupon,
        setCoupon,
        clearCart: () => {
          setCart([]);
          setCoupon('');
        },
        notify,
      }}
    >
      {children}
      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span>✓</span>
            {toast}
          </>
        )}
      </div>
    </ShopContext.Provider>
  );
}
