export const CART_KEY = 'nova-cart-v1';
// Không xóa giỏ trước khi API trả về danh sách sản phẩm hiện hành.
export function sanitizeCart(value, products) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value
    .filter((item) => {
      if (
        !item ||
        typeof item.id !== 'string' ||
        !item.id ||
        (products && !products.some((p) => p.id === item.id)) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        seen.has(item.id)
      )
        return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => ({ id: item.id, quantity: Math.min(10, item.quantity) }));
}
export function readCart() {
  try {
    return sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY) || '[]'));
  } catch {
    return [];
  }
}
export function addItem(cart, id, products = []) {
  if (!products.some((p) => p.id === id)) return cart;
  return cart.some((item) => item.id === id)
    ? cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(10, item.quantity + 1) } : item,
      )
    : [...cart, { id, quantity: 1 }];
}
export function cartTotals(cart, coupon = '', products = []) {
  const subtotal = sanitizeCart(cart, products).reduce(
    (sum, item) => sum + products.find((p) => p.id === item.id).price * item.quantity,
    0,
  );
  const discountAmount = coupon === 'NOVA10' ? Math.min(Math.round(subtotal * 0.1), 500000) : 0;
  const shipping = subtotal === 0 || subtotal >= 2000000 ? 0 : 30000;
  return { subtotal, discountAmount, shipping, total: subtotal - discountAmount + shipping };
}
