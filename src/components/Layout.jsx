import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useShop } from '../context/shop';
import Icon from './Icon';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="NOVA — Trang chủ">
      nova<span>✳</span>
      <small>TECH & LIFESTYLE</small>
    </Link>
  );
}
export default function Layout() {
  const { cart, notify } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setMenuOpen(false);
    if (location.hash) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.search, location.hash]);
  function search(e) {
    e.preventDefault();
    navigate(`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <div className="announcement">
        <div className="container">
          <span>
            <Icon name="truck" size={15} /> Miễn phí vận chuyển cho đơn từ 2 triệu
          </span>
          <Link to="/products">
            Công nghệ mới. Cảm hứng mới. <Icon name="arrowRight" size={14} />
          </Link>
          <span className="announcement-right">Thiết kế cho cuộc sống của bạn</span>
        </div>
      </div>
      <header className="header">
        <div className="container header-main">
          <Logo />
          <form className="search-box" onSubmit={search} role="search">
            <Icon name="search" size={19} />
            <input
              aria-label="Tìm sản phẩm"
              placeholder="Bạn đang tìm sản phẩm gì?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Tìm kiếm">
              <Icon name="arrowRight" size={18} />
            </button>
          </form>
          <Link to="/contact" className="header-support">
            <Icon name="headphones" size={24} />
            <span>
              Luôn sẵn sàng hỗ trợ<b>Liên hệ với NOVA</b>
            </span>
          </Link>
          <Link
            className="cart-link"
            to="/cart"
            aria-label={`Giỏ hàng, ${cart.reduce((n, i) => n + i.quantity, 0)} sản phẩm`}
          >
            <Icon name="bag" size={24} />
            <span>Giỏ hàng</span>
            <b>{cart.reduce((n, i) => n + i.quantity, 0)}</b>
          </Link>
          <button
            className="mobile-menu icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Mở menu"
          >
            <Icon name={menuOpen ? 'x' : 'menu'} />
          </button>
        </div>
        <div className={`nav-wrap ${menuOpen ? 'open' : ''}`}>
          <nav className="container main-nav" aria-label="Điều hướng chính">
            <div>
              {[
                ['/', 'Trang chủ'],
                ['/products', 'Sản phẩm'],
                ['/deals', 'Ưu đãi'],
                ['/about-us', 'Về NOVA'],
                ['/contact', 'Liên hệ'],
              ].map(([to, label]) => (
                <NavLink key={to} to={to} end={to === '/'}>
                  {label}
                  {to === '/deals' && <span className="nav-dot" />}
                </NavLink>
              ))}
            </div>
            <Link className="nav-promo" to="/deals">
              <Icon name="zap" size={15} /> Ưu đãi công nghệ dành riêng cho bạn{' '}
              <Icon name="arrowUp" size={15} />
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <section className="newsletter">
        <div className="container newsletter-inner">
          <div>
            <span className="eyebrow">KẾT NỐI CÙNG NOVA</span>
            <h2>
              Một chút tin mới.
              <br />
              Nhiều điều thú vị.
            </h2>
          </div>
          <div className="newsletter-form">
            <p>Nhận cảm hứng công nghệ và ưu đãi dành riêng cho bạn.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                notify('Bạn đã đăng ký nhận tin trong bản demo. Cảm ơn bạn!');
                e.currentTarget.reset();
              }}
            >
              <input
                type="email"
                required
                placeholder="Địa chỉ email của bạn"
                aria-label="Email đăng ký nhận tin"
              />
              <button type="submit" aria-label="Đăng ký nhận tin">
                <Icon name="arrowRight" />
              </button>
            </form>
            <small>Đăng ký minh họa cho bài tập, không gửi email thực tế.</small>
          </div>
        </div>
      </section>
      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Công nghệ tốt hơn.
              <br />
              Cuộc sống nhiều cảm hứng hơn.
            </p>
            <span className="social-note">Khám phá chất riêng cùng NOVA ↗</span>
          </div>
          <div>
            <h3>Khám phá</h3>
            <Link to="/products">Tất cả sản phẩm</Link>
            <Link to="/products?category=phone">Điện thoại</Link>
            <Link to="/products?category=audio">Âm thanh</Link>
            <Link to="/deals">Ưu đãi hôm nay</Link>
          </div>
          <div>
            <h3>Đồng hành cùng bạn</h3>
            <Link to="/about-us">Câu chuyện NOVA</Link>
            <Link to="/contact">Liên hệ & hỗ trợ</Link>
            <Link to="/about-us#policies">Bảo hành & đổi trả</Link>
            <Link to="/cart">Giỏ hàng của bạn</Link>
          </div>
          <div>
            <h3>Một lời chào từ NOVA</h3>
            <p>
              Website thực hành môn Lập trình Web.
              <br />
              Sản phẩm và giao dịch là dữ liệu mô phỏng.
            </p>
            <Link className="footer-contact" to="/contact">
              Chúng mình luôn lắng nghe <Icon name="arrowUp" size={16} />
            </Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} NOVA. Made for your everyday.</span>
          <span>
            React + Vite · Crafted with care <Icon name="sparkles" size={13} />
          </span>
        </div>
      </footer>
    </>
  );
}
