# Kết quả kiểm tra — NOVA

Ngày kiểm tra: **25/10/2026**.

## Kiểm tra tự động

- `npm test`: **5/5 đạt** — tìm tiếng Việt/chữ hoa, thêm hàng và giới hạn số lượng, loại dữ liệu giỏ hỏng/trùng, phí vận chuyển, mã NOVA10.
- `npm run build`: **đạt** — tạo bản production trong `dist/`.
- Cài dependencies: **0 lỗ hổng** theo kết quả npm tại thời điểm cài.

## Kiểm tra trình duyệt

Đã kiểm tra luồng sử dụng trên Vite dev server và kiểm tra bản production bằng `npm run preview` tại `http://localhost:3000`.

| Tình huống                                                                                  | Kết quả                                                  |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Click menu Về NOVA                                                                          | Mở đúng `/about-us`                                      |
| Tải lại `/about-us`                                                                         | Hiển thị đúng trang giới thiệu                           |
| Tìm `ĐIỆN THOẠI`                                                                            | Trả về 2 điện thoại                                      |
| Lọc Samsung, sắp xếp giá                                                                    | Bộ lọc và giá cập nhật theo URL                          |
| Thêm sản phẩm, tải lại giỏ                                                                  | Giỏ giữ sản phẩm                                         |
| Tăng số lượng                                                                               | Số lượng và tạm tính cùng cập nhật                       |
| Nhập NOVA10 với đơn 33.980.000đ                                                             | Giảm 500.000đ; tổng 33.480.000đ                          |
| Tải lại checkout trên bản production                                                        | Giỏ và mã NOVA10 được giữ                                |
| Đặt Sony WH-1000XM5 với NOVA10                                                              | Đơn thành công có tổng 5.990.000đ                        |
| Gửi checkout trống                                                                          | HTML validation chặn, không tạo đơn                      |
| Xác nhận đơn bằng dữ liệu giả hợp lệ                                                        | Sang `/order-success`, tạo mã đơn demo, giỏ trống        |
| Tải lại trang thành công                                                                    | Mã đơn và tổng tiền vẫn hiển thị                         |
| Form liên hệ với dữ liệu giả hợp lệ                                                         | Hiển thị trạng thái cảm ơn, không gửi dữ liệu ra máy chủ |
| Menu ở viewport 390 × 844                                                                   | Mở menu và đi tới sản phẩm thành công                    |
| Mở trực tiếp giới thiệu, liên hệ, chi tiết, ưu đãi, URL không tồn tại ở viewport điện thoại | Đúng nội dung, không tràn ngang                          |

Ảnh kết quả được lưu trong thư mục này. Kiểm tra trình duyệt được thực hiện thủ công bằng công cụ điều khiển trình duyệt; chưa có bộ E2E tự động. GitHub Actions sẽ chạy lại unit tests và build sau mỗi lần push vào `main`.
