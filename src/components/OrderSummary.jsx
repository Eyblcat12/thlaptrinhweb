import { Link } from 'react-router';
import { money } from '../data/products';
import { cartTotals } from '../lib/cart';
import { useShop } from '../context/shop';
import Icon from './Icon';
export default function OrderSummary({ checkout = false }) {
  const { cart, coupon } = useShop();
  const { subtotal, discountAmount, shipping, total } = cartTotals(cart, coupon);
  return (
    <aside className="order-summary">
      <h2>Tóm tắt đơn hàng</h2>
      <div>
        <span>Tạm tính</span>
        <b>{money(subtotal)}</b>
      </div>
      {discountAmount > 0 && (
        <div className="green">
          <span>Ưu đãi NOVA10</span>
          <b>−{money(discountAmount)}</b>
        </div>
      )}
      <div>
        <span>Phí vận chuyển</span>
        <b>{shipping ? money(shipping) : 'Miễn phí'}</b>
      </div>
      <div className="order-total">
        <span>Tổng cộng</span>
        <strong>{money(total)}</strong>
      </div>
      <p>Giá minh họa, không thanh toán thực tế.</p>
      {!checkout && (
        <Link to="/checkout" className="button button-dark">
          Tiến hành đặt hàng <Icon name="arrowRight" size={18} />
        </Link>
      )}
      <span className="summary-security">
        <Icon name="shield" size={16} /> Trải nghiệm mua sắm mô phỏng
      </span>
    </aside>
  );
}
