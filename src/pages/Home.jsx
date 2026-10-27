import { useState } from 'react';
import { Link } from 'react-router';
import { useShop } from '../context/shop';
import CatalogStatus from '../components/CatalogStatus';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

const benefits = [
  ['truck', 'Giao hàng tận nơi', 'Miễn phí cho đơn từ 2 triệu'],
  ['shield', 'An tâm chất lượng', 'Bảo hành theo hãng'],
  ['rotate', 'Đổi trả dễ dàng', 'Hỗ trợ trong 7 ngày'],
  ['headphones', 'Luôn bên bạn', 'Tư vấn tận tâm, dễ hiểu'],
];
export default function Home() {
  const { products, categories, loading, error } = useShop();
  const [active, setActive] = useState('all');
  const featured =
    active === 'all'
      ? products.slice(0, 4)
      : products.filter((p) => p.category === active).slice(0, 4);
  return (
    <>
      <section className="container hero-section">
        <div className="hero-main">
          <div className="hero-copy">
            <span className="hero-label">
              <span /> CÔNG NGHỆ CHO CHẤT RIÊNG
            </span>
            <h1>
              Thế giới của bạn.
              <br />
              <em>Nâng tầm</em> <br />
              từng trải nghiệm.
            </h1>
            <p>
              Từ giai điệu yêu thích đến ý tưởng lớn tiếp theo.
              <br className="desktop-br" /> Tìm người bạn công nghệ hoàn hảo tại NOVA.
            </p>
            <Link to="/products" className="button button-lime">
              Khám phá ngay <Icon name="arrowUp" size={20} />
            </Link>
            <div className="hero-proof">
              <span className="proof-avatars">
                <i>H</i>
                <i>M</i>
                <i>A</i>
                <i>+</i>
              </span>
              <div>
                <b>Được chọn bởi những người yêu công nghệ</b>
                <span>Mỗi lựa chọn, một trải nghiệm mới.</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="hero-spark">✳</span>
            <span className="vertical-caption">DESIGNED FOR YOUR EVERYDAY</span>
            <img
              src="/images/headphones.svg"
              alt="Tai nghe không dây màu đen, thiết kế tối giản"
              fetchPriority="high"
              width="640"
              height="640"
            />
            <div className="hero-product-tag">
              <span>Đắm chìm trong từng giai điệu</span>
              <b>Sony WH-1000XM5</b>
              <Link to="/products/sony-wh-1000xm5" aria-label="Khám phá Sony WH-1000XM5">
                <Icon name="arrowUp" size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>THẾ GIỚI CÔNG NGHỆ, THEO CÁCH CỦA BẠN</span>
          <span>
            THE NOVA EDIT{' '}
            <span className="slide-decoration" aria-hidden="true">
              ↗
            </span>
          </span>
        </div>
      </section>
      <section className="container benefits" aria-label="Dịch vụ tại NOVA">
        {benefits.map(([icon, title, text]) => (
          <div key={icon}>
            <span className="benefit-icon">
              <Icon name={icon} size={25} />
            </span>
            <div>
              <b>{title}</b>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="container section category-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">TÌM ĐÚNG CHẤT CỦA BẠN</span>
            <h2>Bạn đang tìm gì?</h2>
          </div>
          <Link className="text-link" to="/products">
            Xem tất cả <Icon name="arrowRight" size={17} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.slice(1).map((c, i) => (
            <Link to={`/products?category=${c.id}`} key={c.id}>
              <span className={`category-art category-${c.id}`}>
                <Icon name={c.icon} size={34} />
              </span>
              <div>
                <h3>{c.name}</h3>
                <span>
                  {
                    [
                      'Kết nối mọi khoảnh khắc',
                      'Làm việc đầy cảm hứng',
                      'Giai điệu của riêng bạn',
                      'Đồng hành từng nhịp sống',
                      'Hoàn thiện góc công nghệ',
                    ][i]
                  }
                </span>
              </div>
              <Icon name="arrowUp" size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section className="container section featured-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ĐÁNG ĐỂ BẠN KHÁM PHÁ</span>
            <h2>
              Được yêu thích tại NOVA<span className="heading-dot">.</span>
            </h2>
          </div>
          <Link className="text-link" to="/products">
            Tất cả sản phẩm <Icon name="arrowRight" size={17} />
          </Link>
        </div>
        <div className="tabs" aria-label="Lọc sản phẩm nổi bật">
          {categories.slice(0, 5).map((c) => (
            <button
              key={c.id}
              className={active === c.id ? 'active' : ''}
              onClick={() => setActive(c.id)}
              aria-pressed={active === c.id}
            >
              {c.id === 'all' ? 'Tất cả' : c.name}
            </button>
          ))}
        </div>
        <CatalogStatus />
        {!loading && !error && products.length === 0 && (
          <p className="demo-note">Chưa có sản phẩm. Thêm sản phẩm ở trang quản lý để bắt đầu.</p>
        )}
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="container promo-grid">
        <div className="promo-card promo-audio">
          <div>
            <span className="eyebrow">ÂM THANH KHÔNG GIỚI HẠN</span>
            <h2>
              Bật nhạc lên.
              <br />
              Bật chất riêng.
            </h2>
            <p>Để từng giai điệu chạm đến bạn.</p>
            <Link className="text-link" to="/products?category=audio">
              Khám phá âm thanh <Icon name="arrowUp" size={18} />
            </Link>
          </div>
          <img src="/images/earbuds.svg" alt="Tai nghe không dây cùng hộp sạc" loading="lazy" />
        </div>
        <div className="promo-card promo-laptop">
          <div>
            <span className="eyebrow">KHÔNG GIAN CHO Ý TƯỞNG</span>
            <h2>
              Nhẹ hành trang.
              <br />
              Lớn ý tưởng.
            </h2>
            <p>Sẵn sàng cho điều tuyệt vời tiếp theo.</p>
            <Link className="text-link" to="/products?category=laptop">
              Chọn laptop của bạn <Icon name="arrowUp" size={18} />
            </Link>
          </div>
          <img src="/images/laptop.svg" alt="Laptop mỏng nhẹ cho công việc" loading="lazy" />
        </div>
      </section>
      <section className="container section discovery">
        <div className="discovery-symbol">✳</div>
        <div>
          <span className="eyebrow">KHÔNG CHỈ LÀ CÔNG NGHỆ</span>
          <h2>
            Là cách bạn sống, làm việc
            <br />
            và kết nối với thế giới.
          </h2>
        </div>
        <div>
          <p>
            Tại NOVA, chúng mình tin rằng công nghệ tốt nhất là công nghệ phù hợp với bạn. Dễ chọn
            hơn, dễ dùng hơn, và nhiều cảm hứng hơn mỗi ngày.
          </p>
          <Link className="text-link" to="/about-us">
            Câu chuyện của chúng mình <Icon name="arrowUp" size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
