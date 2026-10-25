import { Link } from 'react-router';
import Icon from './Icon';
export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Đường dẫn">
      <Link to="/">Trang chủ</Link>
      {items.map((item, i) => (
        <span key={i}>
          <Icon name="chevronRight" size={13} />
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
