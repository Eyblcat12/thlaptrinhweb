import { Link, useParams } from 'react-router';
import { discount, money } from '../data/products';
import { useShop } from '../context/shop';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
import NotFound from './NotFound';
import CatalogStatus from '../components/CatalogStatus';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, categories, addToCart, loading, error } = useShop();
  const p = products.find((item) => item.id === id);
  if (loading || error)
    return (
      <div className="container page-content">
        <CatalogStatus />
      </div>
    );
  if (!p) return <NotFound />;
  return (
    <div className="container page-content">
      <Breadcrumb items={[{ label: 'Sản phẩm', to: '/products' }, { label: p.name }]} />
      <div className="product-detail">
        <div className="detail-picture" style={{ background: p.background }}>
          <span className="discount">−{discount(p)}%</span>
          <img src={`/images/${p.art}.svg`} alt={p.name} width="640" height="640" />
          <span className="illustration-note">Hình minh họa thiết kế sản phẩm</span>
        </div>
        <div className="detail-info">
          <Link className="eyebrow" to={`/products?category=${p.category}`}>
            {categories.find((c) => c.id === p.category).name} / {p.brand}
          </Link>
          <h1>{p.name}</h1>
          <p className="detail-tagline">{p.subtitle}</p>
          <div className="rating">
            <Icon name="star" fill="currentColor" size={16} />
            <b>{p.rating}</b>
            <span>· {p.reviews} đánh giá minh họa</span>
            <span className="in-stock">Còn hàng (demo)</span>
          </div>
          <div className="detail-price">
            <strong>{money(p.price)}</strong>
            <del>{money(p.originalPrice)}</del>
            <span>Tiết kiệm {money(p.originalPrice - p.price)}</span>
          </div>
          <div className="color-option">
            <span>
              Màu sắc: <b>{p.color}</b>
            </span>
            <span
              className="color-chip"
              style={{
                background:
                  p.art === 'phone' ? '#7887ab' : p.art === 'earbuds' ? '#f0f0eb' : '#343e36',
              }}
            >
              <Icon name="check" size={16} />
            </span>
          </div>
          <div className="detail-actions">
            <button className="button button-dark" onClick={() => addToCart(p.id)}>
              <Icon name="bag" size={19} /> Thêm vào giỏ hàng
            </button>
            <Link className="button button-outline" to="/cart">
              Xem giỏ hàng <Icon name="arrowRight" size={18} />
            </Link>
          </div>
          <div className="detail-perks">
            <p>
              <Icon name="truck" size={18} /> Miễn phí vận chuyển cho đơn từ 2.000.000đ
            </p>
            <p>
              <Icon name="shield" size={18} /> Bảo hành theo chính sách hãng, hỗ trợ đổi trả 7 ngày
            </p>
          </div>
          <p className="demo-note">
            Sản phẩm, đánh giá và giá bán là dữ liệu minh họa cho bài tập. Không phát sinh giao dịch
            thật.
          </p>
        </div>
      </div>
      <section className="spec-section">
        <div>
          <span className="eyebrow">TỪNG CHI TIẾT ĐỀU ĐÁNG GIÁ</span>
          <h2>Một lựa chọn cho mỗi ngày.</h2>
          <p>
            {p.subtitle} {p.name} mang đến sự kết hợp giữa thiết kế tinh tế và những tính năng hữu
            ích, giúp bạn tận hưởng công nghệ theo cách riêng.
          </p>
        </div>
        <div>
          <h2>Thông số nổi bật</h2>
          <dl>
            {Object.entries(p.specs).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <small>Thông số tham khảo phục vụ minh họa giao diện.</small>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <h2>Có thể bạn cũng thích</h2>
          <Link to="/products" className="text-link">
            Khám phá thêm <Icon name="arrowRight" size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((item) => item.id !== id)
            .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category))
            .slice(0, 4)
            .map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </section>
    </div>
  );
}
