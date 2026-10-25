import { Link } from 'react-router';
import { useShop } from '../context/shop';
import { discount, money } from '../data/products';
import Icon from './Icon';

export default function ProductCard({ product: p }) {
  const { addToCart } = useShop();
  return (
    <article className="product-card">
      <Link
        to={`/products/${p.id}`}
        className="product-picture"
        style={{ background: p.background }}
        aria-label={`Xem ${p.name}`}
      >
        <span className="discount">−{discount(p)}%</span>
        {p.badge && <span className="product-badge">{p.badge}</span>}
        <img src={`/images/${p.art}.svg`} alt={p.name} loading="lazy" width="280" height="240" />
        <span className="quick-view">
          Khám phá sản phẩm <Icon name="arrowUp" size={16} />
        </span>
      </Link>
      <div className="product-info">
        <span className="product-brand">{p.brand}</span>
        <h3>
          <Link to={`/products/${p.id}`}>{p.name}</Link>
        </h3>
        <div className="rating">
          <Icon name="star" size={13} fill="currentColor" />
          <b>{p.rating.toFixed(1)}</b>
          <span>({p.reviews} đánh giá)</span>
        </div>
        <div className="product-bottom">
          <div>
            <strong>{money(p.price)}</strong>
            <del>{money(p.originalPrice)}</del>
          </div>
          <button
            className="add-button"
            onClick={() => addToCart(p.id)}
            aria-label={`Thêm ${p.name} vào giỏ hàng`}
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
    </article>
  );
}
