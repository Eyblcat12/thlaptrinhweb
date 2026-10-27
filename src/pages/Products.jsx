import { Link, useSearchParams } from 'react-router';
import { discount, normalize } from '../data/products';
import { useShop } from '../context/shop';
import CatalogStatus from '../components/CatalogStatus';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';

export default function Products({ deals = false }) {
  const { products, categories, loading, error } = useShop();
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'all';
  const query = params.get('q') || '';
  const brand = params.get('brand') || 'all';
  const price = params.get('price') || 'all';
  const sort = params.get('sort') || 'popular';
  function update(key, value) {
    const next = new URLSearchParams(params);
    value && value !== 'all' ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: key === 'q' });
  }
  let filtered = products.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (brand === 'all' || p.brand === brand) &&
      (!deals || discount(p) >= 25) &&
      normalize(
        `${p.name} ${p.brand} ${categories.find((c) => c.id === p.category)?.name}`,
      ).includes(normalize(query)) &&
      (price === 'all' ||
        (price === 'under5' && p.price < 5000000) ||
        (price === '5to15' && p.price >= 5000000 && p.price <= 15000000) ||
        (price === 'over15' && p.price > 15000000)),
  );
  filtered = [...filtered].sort((a, b) =>
    sort === 'price-asc'
      ? a.price - b.price
      : sort === 'price-desc'
        ? b.price - a.price
        : sort === 'discount'
          ? discount(b) - discount(a)
          : b.reviews - a.reviews,
  );
  const hasFilters = category !== 'all' || brand !== 'all' || price !== 'all' || query;
  if (loading || error)
    return (
      <div className="container page-content">
        <CatalogStatus />
      </div>
    );
  return (
    <div className="container page-content">
      <Breadcrumb items={[{ label: deals ? 'Ưu đãi' : 'Sản phẩm' }]} />
      <div className={`catalog-banner ${deals ? 'deal-banner' : ''}`}>
        <div>
          <span className="eyebrow">
            {deals ? 'THÊM TRẢI NGHIỆM, BỚT CHI PHÍ' : 'TÌM NGƯỜI BẠN CÔNG NGHỆ CỦA BẠN'}
          </span>
          <h1>{deals ? 'Nâng cấp hôm nay. Tiết kiệm nhiều hơn.' : 'Công nghệ hợp chất bạn.'}</h1>
          <p>
            {deals
              ? 'Các sản phẩm đang giảm từ 25%. Giá minh họa cho bài tập.'
              : 'Những lựa chọn đáng yêu cho công việc, giải trí và mỗi ngày.'}
          </p>
        </div>
        <Icon name={deals ? 'zap' : 'sparkles'} size={76} />
      </div>
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <h2>
            <Icon name="sliders" size={18} /> Bộ lọc sản phẩm
          </h2>
          <fieldset>
            <legend>Danh mục</legend>
            {categories.map((c) => (
              <label key={c.id} className={category === c.id ? 'selected' : ''}>
                <input
                  type="radio"
                  name="category"
                  checked={category === c.id}
                  onChange={() => update('category', c.id)}
                />
                <Icon name={c.icon} size={17} />
                {c.name}
                <span>{products.filter((p) => c.id === 'all' || p.category === c.id).length}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Khoảng giá</legend>
            {[
              ['all', 'Tất cả mức giá'],
              ['under5', 'Dưới 5 triệu'],
              ['5to15', 'Từ 5 – 15 triệu'],
              ['over15', 'Trên 15 triệu'],
            ].map(([id, name]) => (
              <label key={id}>
                <input
                  type="radio"
                  name="price"
                  checked={price === id}
                  onChange={() => update('price', id)}
                />
                {name}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Thương hiệu</legend>
            <select
              aria-label="Lọc thương hiệu"
              value={brand}
              onChange={(e) => update('brand', e.target.value)}
            >
              <option value="all">Tất cả thương hiệu</option>
              {[...new Set(products.map((p) => p.brand))].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </fieldset>
          {hasFilters && (
            <button className="reset-filter" onClick={() => setParams({})}>
              <Icon name="rotate" size={15} /> Xóa bộ lọc
            </button>
          )}
          <div className="sidebar-note">
            <Icon name="headphones" size={28} />
            <h3>Cần một chút gợi ý?</h3>
            <p>Chúng mình giúp bạn chọn sản phẩm phù hợp.</p>
            <Link to="/contact">Trò chuyện với NOVA ↗</Link>
          </div>
        </aside>
        <section className="catalog-results" aria-label="Danh sách sản phẩm">
          <form className="catalog-search" onSubmit={(e) => e.preventDefault()}>
            <Icon name="search" size={19} />
            <input
              aria-label="Tìm trong danh sách sản phẩm"
              placeholder="Tìm tên sản phẩm, thương hiệu..."
              value={query}
              onChange={(e) => update('q', e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="icon-button"
                onClick={() => update('q', '')}
                aria-label="Xóa tìm kiếm"
              >
                <Icon name="x" size={16} />
              </button>
            )}
          </form>
          <div className="results-toolbar">
            <span>
              <b>{filtered.length}</b> sản phẩm {query && <>cho “{query}”</>}
            </span>
            <label>
              Sắp xếp:{' '}
              <select value={sort} onChange={(e) => update('sort', e.target.value)}>
                <option value="popular">Được yêu thích</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="discount">Giảm giá nhiều nhất</option>
              </select>
            </label>
          </div>
          {filtered.length ? (
            <div className="product-grid catalog-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="search" size={44} />
              <h2>Chưa tìm thấy sản phẩm</h2>
              <p>Thử tên sản phẩm khác hoặc bỏ bớt bộ lọc nhé.</p>
              <button className="button button-dark" onClick={() => setParams({})}>
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
