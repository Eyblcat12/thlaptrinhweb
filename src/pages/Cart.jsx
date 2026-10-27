import { useState } from 'react';
import { Link } from 'react-router';
import { useShop } from '../context/shop';
import { money } from '../data/products';
import CatalogStatus from '../components/CatalogStatus';
import Breadcrumb from '../components/Breadcrumb';
import OrderSummary from '../components/OrderSummary';
import Icon from '../components/Icon';

export default function Cart() {
  const { cart, products, setQuantity, coupon, setCoupon, loading, error } = useShop();
  const [input, setInput] = useState(coupon);
  const [couponError, setCouponError] = useState('');
  function applyCoupon(e) {
    e.preventDefault();
    if (input.trim().toUpperCase() === 'NOVA10') {
      setCoupon('NOVA10');
      setCouponError('');
    } else {
      setCouponError('Mã chưa hợp lệ. Thử NOVA10 để giảm 10%, tối đa 500.000đ.');
    }
  }
  if (loading || error)
    return (
      <div className="container page-content">
        <CatalogStatus />
      </div>
    );
  return (
    <div className="container page-content">
      <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />
      <div className="page-heading">
        <span className="eyebrow">NHỮNG LỰA CHỌN CỦA BẠN</span>
        <h1>
          Giỏ hàng<span className="heading-dot">.</span>
        </h1>
        <p>
          {cart.length
            ? `${cart.reduce((n, i) => n + i.quantity, 0)} sản phẩm đang chờ đồng hành cùng bạn.`
            : 'Một điều thú vị đang chờ bạn khám phá.'}
        </p>
      </div>
      {!cart.length ? (
        <div className="empty-state">
          <Icon name="bag" size={54} />
          <h2>Giỏ hàng của bạn còn trống</h2>
          <p>Tìm một người bạn công nghệ mới tại NOVA nhé.</p>
          <Link className="button button-dark" to="/products">
            Khám phá sản phẩm <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            <div className="cart-items">
              {cart.map((item) => {
                const p = products.find((p) => p.id === item.id);
                return (
                  <article key={p.id} className="cart-item">
                    <Link
                      to={`/products/${p.id}`}
                      className="cart-thumb"
                      style={{ background: p.background }}
                    >
                      <img src={`/images/${p.art}.svg`} alt={p.name} width="120" height="120" />
                    </Link>
                    <div className="cart-item-info">
                      <span className="product-brand">{p.brand}</span>
                      <h2>
                        <Link to={`/products/${p.id}`}>{p.name}</Link>
                      </h2>
                      <p>{p.color}</p>
                      <strong>{money(p.price)}</strong>
                    </div>
                    <div className="cart-quantity">
                      <div className="quantity-control">
                        <button
                          onClick={() => setQuantity(p.id, item.quantity - 1)}
                          aria-label={`Giảm số lượng ${p.name}`}
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <span aria-label="Số lượng">{item.quantity}</span>
                        <button
                          disabled={item.quantity >= 10}
                          onClick={() => setQuantity(p.id, item.quantity + 1)}
                          aria-label={`Tăng số lượng ${p.name}`}
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                      <strong>{money(p.price * item.quantity)}</strong>
                    </div>
                    <button
                      className="remove-item icon-button"
                      onClick={() => setQuantity(p.id, 0)}
                      aria-label={`Xóa ${p.name}`}
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </article>
                );
              })}
            </div>
            <form className="coupon-form" onSubmit={applyCoupon}>
              <label htmlFor="coupon">Một chút ưu đãi dành cho bạn</label>
              <div>
                <input
                  id="coupon"
                  placeholder="Nhập mã NOVA10"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                />
                <button className="button button-outline" type="submit">
                  Áp dụng
                </button>
              </div>
              {couponError && (
                <p className="form-error" role="alert">
                  {couponError}
                </p>
              )}
              {coupon && (
                <p className="green">
                  Đã áp dụng NOVA10: giảm 10%, tối đa 500.000đ.{' '}
                  <button
                    type="button"
                    className="inline-button"
                    onClick={() => {
                      setCoupon('');
                      setInput('');
                      setCouponError('');
                    }}
                  >
                    Gỡ mã
                  </button>
                </p>
              )}
              <small>Miễn phí vận chuyển từ 2 triệu. Đơn dưới 2 triệu: 30.000đ.</small>
            </form>
            <Link className="text-link" to="/products">
              <Icon name="arrowLeft" size={17} /> Tiếp tục khám phá
            </Link>
          </div>
          <OrderSummary />
        </div>
      )}
    </div>
  );
}
