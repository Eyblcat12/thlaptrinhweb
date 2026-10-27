import { useCallback, useEffect, useRef, useState } from 'react';
import { addItem, CART_KEY, readCart, sanitizeCart } from '../lib/cart';
import { ShopContext } from './shop';
import { apiError, categoriesApi, productsApi } from '../services/api';

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(readCart);
  const [products, setProducts] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const request = useRef(null);
  const reloadCatalog = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError('');
    try {
      const [items, groups] = await Promise.all([
        productsApi.getAll(controller.signal),
        categoriesApi.getAll(controller.signal),
      ]);
      if (controller.signal.aborted) return false;
      setProducts(items);
      setCatalogCategories(groups);
      setCart((current) => sanitizeCart(current, items));
      setLoading(false);
      return true;
    } catch (failure) {
      if (controller.signal.aborted) return false;
      setError(apiError(failure));
      setLoading(false);
      return false;
    }
  }, []);
  useEffect(() => {
    reloadCatalog();
    return () => request.current?.abort();
  }, [reloadCatalog]);
  const categories = [{ id: 'all', name: 'Tất cả sản phẩm', icon: 'grid' }, ...catalogCategories];
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
    if (!products.some((p) => p.id === id)) return;
    setCart((current) => addItem(current, id, products));
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
        products,
        categories,
        loading,
        error,
        reloadCatalog,
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
