import { Link } from 'react-router';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';

export default function About() {
  return (
    <div className="container page-content">
      <Breadcrumb items={[{ label: 'Về NOVA' }]} />
      <section className="about-hero">
        <div>
          <span className="eyebrow">XIN CHÀO, CHÚNG MÌNH LÀ NOVA</span>
          <h1>
            Công nghệ gần hơn.
            <br />
            Cuộc sống <em>chất hơn.</em>
          </h1>
          <p>
            Mỗi ngày đều có những điều mới để khám phá. Chúng mình ở đây để giúp bạn tìm thấy công
            nghệ đồng hành với những điều ấy.
          </p>
          <Link className="button button-dark" to="/products">
            Tìm cảm hứng của bạn <Icon name="arrowUp" size={18} />
          </Link>
        </div>
        <div className="about-art">
          <span>✳</span>
          <img
            src="/images/headphones.svg"
            alt="Công nghệ đồng hành với cuộc sống"
            width="500"
            height="500"
          />
          <b>
            GOOD TECH.
            <br />
            GREAT DAYS.
          </b>
        </div>
      </section>
      <section className="about-story section">
        <span className="eyebrow">MỘT Ý TƯỞNG ĐƠN GIẢN</span>
        <h2>
          Công nghệ không cần phức tạp.
          <br />
          Lựa chọn cũng vậy.
        </h2>
        <div>
          <p>
            NOVA ra đời từ mong muốn tạo nên một nơi mua sắm công nghệ dễ hiểu và đầy cảm hứng. Từ
            chiếc tai nghe cho một buổi chiều yên tĩnh đến chiếc laptop để biến ý tưởng thành hiện
            thực, mỗi sản phẩm đều có một câu chuyện riêng.
          </p>
          <p>
            Chúng mình chọn cách giới thiệu sản phẩm rõ ràng, sắp xếp thông tin gọn gàng và đặt trải
            nghiệm của bạn ở trung tâm. Website này là dự án học tập môn Lập trình Web, xây dựng
            bằng React, Vite và React Router.
          </p>
        </div>
      </section>
      <div className="values-grid">
        {[
          [
            'sparkles',
            'Chọn lọc có tâm',
            'Những sản phẩm hữu ích, thiết kế đẹp và phù hợp với nhiều nhu cầu.',
          ],
          ['heart', 'Lắng nghe bạn', 'Bắt đầu từ điều bạn cần, để mỗi lựa chọn đều có ý nghĩa.'],
          [
            'shield',
            'Rõ ràng, an tâm',
            'Thông tin dễ hiểu và chính sách minh bạch trong từng trải nghiệm.',
          ],
        ].map(([icon, title, text]) => (
          <article key={icon}>
            <Icon name={icon} size={29} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <section className="policies section" id="policies">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ĐỒNG HÀNH SAU MỖI LỰA CHỌN</span>
            <h2>Chính sách tham khảo</h2>
          </div>
        </div>
        <p className="demo-note">
          Các chính sách dưới đây được xây dựng để minh họa website bán hàng, chưa áp dụng cho giao
          dịch thực tế.
        </p>
        {[
          [
            'Giao hàng được tính như thế nào?',
            'Đơn hàng từ 2.000.000đ được miễn phí vận chuyển. Đơn dưới mức này có phí minh họa 30.000đ. Tổng phí được hiển thị trước khi xác nhận đơn hàng.',
          ],
          [
            'NOVA hỗ trợ đổi trả ra sao?',
            'Chính sách minh họa hỗ trợ đổi trả trong 7 ngày với sản phẩm lỗi kỹ thuật, còn đầy đủ phụ kiện và bao bì. Liên hệ trang hỗ trợ để xem mẫu quy trình.',
          ],
          [
            'Bảo hành sản phẩm như thế nào?',
            'Bảo hành tham khảo theo điều kiện của từng hãng. Website này không cung cấp dịch vụ bảo hành hoặc bán hàng thực tế.',
          ],
          [
            'Dữ liệu của tôi được lưu ở đâu?',
            'Giỏ hàng được lưu trong localStorage trên trình duyệt của bạn. Mã đơn demo và tổng tiền được lưu trong sessionStorage. Biểu mẫu liên hệ, nhận tin và giao hàng không gửi thông tin tới máy chủ.',
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Icon name="plus" size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
