import { Link } from 'react-router';
import Icon from '../components/Icon';
export default function NotFound() {
  return (
    <div className="container empty-state not-found">
      <span className="error-code">404</span>
      <h1>Hình như bạn đã đi hơi xa.</h1>
      <p>Trang hoặc sản phẩm này không tồn tại. Cùng quay lại khám phá nhé.</p>
      <Link to="/" className="button button-dark">
        Về trang chủ <Icon name="arrowRight" size={18} />
      </Link>
    </div>
  );
}
