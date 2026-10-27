import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { useShop } from '../context/shop';
import { cartTotals } from '../lib/cart';
import { money } from '../data/products';
import Breadcrumb from '../components/Breadcrumb';
import OrderSummary from '../components/OrderSummary';
import Icon from '../components/Icon';
import CatalogStatus from '../components/CatalogStatus';

export function Checkout() {
  const { cart, coupon, clearCart, products, loading, error } = useShop();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  if (loading || error)
    return (
      <div className="container page-content">
        <CatalogStatus />
      </div>
    );
  // Trong lúc điều hướng thành công, giỏ đã được xóa nhưng trang chưa unmount.
  if (!cart.length && !submitting) return <Navigate to="/cart" replace />;
  function submit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const order = {
      id: `NOVA-${Date.now().toString(36).toUpperCase()}`,
      total: cartTotals(cart, coupon, products).total,
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
    };
    // Chỉ lưu mã đơn và tổng tiền demo; không lưu dữ liệu liên hệ của khách.
    try {
      sessionStorage.setItem('nova-last-order', JSON.stringify(order));
    } catch {
      /* Vẫn hiển thị đơn qua router state. */
    }
    clearCart();
    navigate('/order-success', { replace: true, state: { order } });
  }
  return (
    <div className="container page-content">
      <Breadcrumb items={[{ label: 'Giỏ hàng', to: '/cart' }, { label: 'Đặt hàng' }]} />
      <div className="page-heading">
        <span className="eyebrow">GẦN HƠN VỚI TRẢI NGHIỆM MỚI</span>
        <h1>
          Hoàn tất đơn hàng<span className="heading-dot">.</span>
        </h1>
      </div>
      <div className="demo-banner">
        <Icon name="package" size={22} />
        <p>
          <b>Đây là quy trình đặt hàng mô phỏng.</b> Không nhập thông tin nhạy cảm. Thông tin liên
          hệ không được lưu hay gửi tới máy chủ.
        </p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form form-card" onSubmit={submit}>
          <h2>Thông tin giao hàng</h2>
          <div className="form-grid">
            <label>
              Họ và tên *
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </label>
            <label>
              Số điện thoại *
              <input
                name="phone"
                type="tel"
                required
                pattern="0[0-9]{9}"
                title="Nhập số điện thoại gồm 10 chữ số, bắt đầu bằng 0"
                placeholder="0901234567"
                autoComplete="tel"
              />
            </label>
            <label className="full-width">
              Email *
              <input
                name="email"
                type="email"
                required
                placeholder="ban@example.com"
                autoComplete="email"
              />
            </label>
            <label className="full-width">
              Tỉnh / Thành phố *
              <input
                name="city"
                required
                minLength={2}
                placeholder="Ví dụ: Thành phố Hồ Chí Minh"
                autoComplete="address-level1"
              />
            </label>
            <label className="full-width">
              Địa chỉ nhận hàng *
              <input
                name="address"
                required
                minLength={8}
                placeholder="Số nhà, đường, phường/xã, quận/huyện"
                autoComplete="street-address"
              />
            </label>
            <label className="full-width">
              Ghi chú cho đơn hàng
              <textarea
                name="note"
                rows="3"
                placeholder="Bạn muốn nhắn gì với NOVA?"
                maxLength={500}
              />
            </label>
          </div>
          <fieldset className="payment-method">
            <legend>Phương thức thanh toán</legend>
            <label>
              <input type="radio" name="payment" checked readOnly />
              <Icon name="creditCard" size={22} />
              <span>
                <b>Thanh toán khi nhận hàng (COD)</b>
                <small>Mô phỏng — không thu tiền hoặc giao hàng thật</small>
              </span>
            </label>
          </fieldset>
          <label className="checkbox-label">
            <input type="checkbox" required />
            Tôi hiểu đây là đơn hàng mô phỏng phục vụ bài tập.
          </label>
          <button className="button button-dark" type="submit" disabled={submitting}>
            Xác nhận đặt hàng mô phỏng <Icon name="arrowRight" size={18} />
          </button>
        </form>
        <OrderSummary checkout />
      </div>
    </div>
  );
}

export function OrderSuccess() {
  const location = useLocation();
  let order = location.state?.order;
  if (!order) {
    try {
      order = JSON.parse(sessionStorage.getItem('nova-last-order') || 'null');
    } catch {
      /* Dữ liệu không hợp lệ. */
    }
  }
  if (
    !order ||
    typeof order.id !== 'string' ||
    !Number.isFinite(order.total) ||
    !Number.isInteger(order.count)
  )
    return <Navigate to="/cart" replace />;
  return (
    <div className="container page-content">
      <div className="success-card">
        <span className="success-icon">
          <Icon name="check" size={38} />
        </span>
        <span className="eyebrow">CẢM ƠN BẠN ĐÃ CHỌN NOVA</span>
        <h1>Khởi đầu một trải nghiệm mới.</h1>
        <p>Đơn hàng mô phỏng của bạn đã được tạo thành công.</p>
        <dl>
          <div>
            <dt>Mã đơn hàng</dt>
            <dd>{order.id}</dd>
          </div>
          <div>
            <dt>Số lượng</dt>
            <dd>{order.count} sản phẩm</dd>
          </div>
          <div>
            <dt>Tổng giá trị</dt>
            <dd>{money(order.total)}</dd>
          </div>
        </dl>
        <div className="demo-banner">
          Đây là kết quả minh họa. Không có giao dịch, email xác nhận hoặc vận chuyển thực tế.
        </div>
        <Link to="/products" className="button button-dark">
          Tiếp tục khám phá <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </div>
  );
}
