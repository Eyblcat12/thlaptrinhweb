import { useShop } from '../context/shop';
import Icon from './Icon';

export default function CatalogStatus() {
  const { loading, error, reloadCatalog } = useShop();
  if (loading)
    return (
      <div className="catalog-state" role="status">
        <span className="loading-dot" /> Đang tải sản phẩm từ NOVA API…
      </div>
    );
  if (error)
    return (
      <div className="catalog-state catalog-error" role="alert">
        <Icon name="package" size={26} />
        <div>
          <h2>Chưa tải được dữ liệu sản phẩm</h2>
          <p>{error}</p>
          <button className="button button-outline" onClick={reloadCatalog}>
            Thử lại <Icon name="rotate" size={16} />
          </button>
        </div>
      </div>
    );
  return null;
}
