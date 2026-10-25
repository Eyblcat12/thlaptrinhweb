import { useState } from 'react';
import { Link } from 'react-router';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container page-content">
      <Breadcrumb items={[{ label: 'Liên hệ' }]} />
      <div className="page-heading">
        <span className="eyebrow">CHÚNG MÌNH LUÔN LẮNG NGHE</span>
        <h1>
          Bắt đầu bằng một lời chào<span className="heading-dot">.</span>
        </h1>
        <p>Cần tư vấn sản phẩm hay có điều muốn chia sẻ? NOVA ở đây cùng bạn.</p>
      </div>
      <div className="contact-layout">
        <div className="contact-info">
          <h2>Rất vui được kết nối.</h2>
          <p>Một chút thắc mắc, một ý tưởng mới hay một lời góp ý — tất cả đều được chào đón.</p>
          <div className="contact-method">
            <Icon name="headphones" size={25} />
            <div>
              <b>Tư vấn & hỗ trợ</b>
              <span>Thứ Hai – Thứ Bảy · 8:00 – 20:00</span>
            </div>
          </div>
          <div className="contact-method">
            <Icon name="mail" size={25} />
            <div>
              <b>Gửi lời nhắn ngay tại đây</b>
              <span>Điền biểu mẫu để trải nghiệm tính năng demo.</span>
            </div>
          </div>
          <div className="contact-method">
            <Icon name="mapPin" size={25} />
            <div>
              <b>Không gian NOVA</b>
              <span>Dự án học tập trực tuyến tại Việt Nam</span>
            </div>
          </div>
          <div className="contact-help">
            <Icon name="sparkles" size={26} />
            <h3>Có thể câu trả lời đã ở đây.</h3>
            <p>Xem thêm thông tin về giao hàng, bảo hành và đổi trả.</p>
            <Link className="text-link" to="/about-us#policies">
              Khám phá chính sách <Icon name="arrowUp" size={17} />
            </Link>
          </div>
        </div>
        <div className="form-card contact-form">
          {sent ? (
            <div className="form-success" role="status">
              <span className="success-icon">
                <Icon name="check" size={32} />
              </span>
              <h2>Cảm ơn lời nhắn của bạn!</h2>
              <p>
                Biểu mẫu đã được kiểm tra thành công trong bản demo. Nội dung không được gửi hoặc
                lưu trên máy chủ.
              </p>
              <button className="button button-dark" onClick={() => setSent(false)}>
                Viết lời nhắn mới <Icon name="arrowRight" size={18} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <h2>Để lại lời nhắn cho NOVA</h2>
              <div className="form-grid">
                <label>
                  Họ và tên *
                  <input
                    required
                    minLength={2}
                    placeholder="Tên của bạn"
                    name="name"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Email *
                  <input
                    required
                    type="email"
                    placeholder="ban@example.com"
                    name="email"
                    autoComplete="email"
                  />
                </label>
                <label className="full-width">
                  Bạn cần hỗ trợ về *
                  <select name="topic" required defaultValue="">
                    <option value="" disabled>
                      Chọn chủ đề
                    </option>
                    <option>Tư vấn sản phẩm</option>
                    <option>Đơn hàng & giao nhận</option>
                    <option>Bảo hành & đổi trả</option>
                    <option>Góp ý về website</option>
                  </select>
                </label>
                <label className="full-width">
                  Nội dung lời nhắn *
                  <textarea
                    name="message"
                    rows="6"
                    required
                    minLength={10}
                    maxLength={2000}
                    placeholder="Chia sẻ điều bạn đang quan tâm (ít nhất 10 ký tự)..."
                  />
                </label>
              </div>
              <p className="demo-note">Biểu mẫu phục vụ bài tập, không gửi email thực tế.</p>
              <button className="button button-dark" type="submit">
                Gửi lời nhắn (demo) <Icon name="arrowUp" size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
