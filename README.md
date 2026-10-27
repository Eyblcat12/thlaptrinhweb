# NOVA — Website bán hàng điện tử

Dự án thực hành môn **Lập trình Web**: **React + Vite + React Router + Axios** ở frontend; **ASP.NET Core Web API + EF Core + SQLite** ở backend. Giao diện tiếng Việt, responsive.

**Repository nộp bài:** https://github.com/Eyblcat12/thlaptrinhweb

![Giao diện NOVA](docs/home-desktop.png)

[Xem trang quản lý kết nối API](docs/manage-desktop.png)

[Hướng dẫn API, Axios và EF Core](backend/README.md) · [Kết quả kiểm tra](docs/TESTING.md) · [Toàn bộ trang chủ](docs/home-preview.png) · [Giao diện điện thoại](docs/mobile-preview.png)

## Chạy project

Cần **Node.js 22.12+** (khuyến nghị Node.js 24 LTS) và **.NET 10 SDK**. .NET Runtime không đủ để build. Trên máy hiện tại đã có SDK riêng trong `.tools/dotnet/`; script npm tự sử dụng nếu có. Thư mục này không đưa lên Git. Trên máy khác, cài .NET 10 SDK thông thường.

Từ thư mục gốc repository:

```bash
npm ci
npm run dotnet -- restore backend/Nova.Api
npm run dotnet -- tool restore
npm run db:update
```

Mở hai terminal tại thư mục gốc. Terminal thứ nhất chạy backend:

```bash
npm run api
```

Terminal thứ hai chạy frontend:

```bash
npm run dev
```

- Frontend: **http://localhost:3000**
- Quản lý sản phẩm: **http://localhost:3000/admin/products**
- API: **http://localhost:5080/api/products**
- Kiểm tra kết nối: **http://localhost:5080/api/health**
- OpenAPI JSON (Development): **http://localhost:5080/openapi/v1.json**

Vite proxy `/api` sang backend cổng 5080. Nếu cổng 3000 đã được dùng, xem cổng thực tế Vite in trong terminal. Trong Development, API tự áp dụng migration và seed 12 sản phẩm / 5 danh mục một lần. Thay đổi CRUD được lưu trong `backend/Nova.Api/App_Data/nova.db`, không tự khôi phục sau khi khởi động lại.

## Đáp ứng yêu cầu bài tập

| Yêu cầu                                | Phần thực hiện                                                    |
| -------------------------------------- | ----------------------------------------------------------------- |
| React với Vite                         | `src/main.jsx`, `vite.config.js`                                  |
| HTML giao diện trang chủ               | JSX có semantic HTML trong `src/pages/Home.jsx`                   |
| CSS riêng, responsive                  | `src/styles.css`                                                  |
| Nhiều pages/components                 | `src/pages/`, `src/components/`                                   |
| React Router, chuyển trang từ menu/URL | `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`             |
| Project API ASP.NET Core               | `backend/Nova.Api/`, target `net10.0`                             |
| Controllers GET, POST, PUT, DELETE     | `ProductsController`, `CategoriesController`                      |
| Frontend gọi backend qua Axios         | `src/services/api.js`, `ShopContext`, `ManageProducts`            |
| Cấu hình kết nối database              | `ConnectionStrings:NovaDatabase`, `UseSqlite`                     |
| EF Core và tạo migration               | `NovaDbContext`, model, migration `InitialCreate`, model snapshot |

## Các trang

| URL                               | Nội dung                                        |
| --------------------------------- | ----------------------------------------------- |
| `/`                               | Trang chủ, danh mục, sản phẩm nổi bật           |
| `/products`                       | Sản phẩm từ API, tìm kiếm, lọc, sắp xếp         |
| `/products?category=phone`        | Lọc danh mục qua URL                            |
| `/products?q=sony&sort=price-asc` | Tìm và sắp xếp qua URL                          |
| `/products/sony-wh-1000xm5`       | Chi tiết sản phẩm theo route động               |
| `/admin/products`                 | Đọc, thêm, sửa, xác nhận xóa sản phẩm qua Axios |
| `/deals`                          | Sản phẩm giảm từ 25%                            |
| `/about-us`                       | Giới thiệu NOVA                                 |
| `/about-us#policies`              | Chính sách minh họa, FAQ                        |
| `/contact`                        | Form liên hệ demo có validation                 |
| `/cart`                           | Giỏ hàng, số lượng, mã giảm giá                 |
| `/checkout`                       | Đặt hàng mô phỏng, cần có sản phẩm trong giỏ    |
| `/order-success`                  | Kết quả đơn mô phỏng đã tạo                     |
| URL khác                          | Trang 404                                       |

Mở thẳng **http://localhost:3000/about-us**, bấm F5 hoặc click **Về NOVA** đều hiển thị trang giới thiệu. `BrowserRouter` dùng History API, không cần dấu `#` trong đường dẫn trang.

## Chức năng

- Sản phẩm và danh mục tải từ ASP.NET Core API; không âm thầm dùng dữ liệu cứng khi backend lỗi.
- Trang quản lý gọi Axios GET/POST/PUT/DELETE thật, có loading, thông báo lỗi, thử lại, kiểm tra dữ liệu và hộp thoại xác nhận xóa.
- Backend trả `201 + Location` khi thêm, `204` khi sửa/xóa; `400`, `404`, `409` cho dữ liệu sai, mã không tồn tại, xung đột.
- Khóa ngoại bảo vệ danh mục đang chứa sản phẩm.
- Tìm kiếm tiếng Việt có dấu/không dấu; lọc thương hiệu, danh mục, khoảng giá; sắp xếp theo giá, đánh giá phổ biến, mức giảm.
- Thông số sản phẩm, hình SVG cục bộ, sản phẩm gợi ý.
- Giỏ hàng lưu localStorage, số lượng tối đa 10 mỗi loại. Giá được tính theo danh sách API hiện hành.
- NOVA10 giảm 10%, tối đa 500.000đ. Phí vận chuyển 30.000đ; miễn phí từ 2 triệu trước giảm giá.
- Form đặt hàng COD, liên hệ, nhận tin vẫn là demo, không gửi dữ liệu cá nhân tới backend.

## Kiểm tra

```bash
npm test
npm run build
npm run api:build
npm run test:api
```

`npm test`: 6 kiểm tra frontend. `npm run test:api`: 11 nhóm kiểm tra HTTP thật và SQLite riêng, cần build API trước. Test API tự chọn cổng trống và không dùng database cửa hàng. GitHub Actions chạy cả frontend lẫn backend.

Để trình bày bài: mở **Quản lý**, thêm sản phẩm thử nghiệm, sửa giá, kiểm tra giá mới tại cửa hàng và giỏ, rồi xóa sản phẩm thử nghiệm. Dùng DevTools → Network, lọc `api/products` để quan sát đủ GET/POST/PUT/DELETE.

## Cấu trúc

```text
src/
  components/           # Layout, ProductCard, CatalogStatus, OrderSummary...
  context/              # ShopProvider tải dữ liệu API, quản lý giỏ hàng
  services/api.js       # Axios instance và request CRUD
  data/products.js      # Hàm tiền tệ, mức giảm, tìm không dấu
  lib/cart.js           # Giỏ hàng và tổng tiền theo dữ liệu API
  pages/                # Trang bán hàng và ManageProducts
  App.jsx               # Routes
  styles.css            # CSS responsive
backend/
  Nova.Api/
    Controllers/        # ProductsController, CategoriesController
    Contracts/          # DTO, validation, response
    Models/             # Product, Category, SeedState
    Data/               # NovaDbContext, seed JSON và seed logic
    Migrations/         # InitialCreate + model snapshot
    App_Data/           # SQLite phát sinh, gitignore
    Nova.Api.http       # Request mẫu
  README.md             # Hướng dẫn backend, Axios, database, migration
scripts/
  dotnet.mjs            # Chọn SDK local hoặc SDK trên máy
  test-api.mjs          # Kiểm thử API thật với database riêng
tests/cart.test.js
.config/dotnet-tools.json
.github/workflows/ci.yml
```

## Database và migration

Cấu hình SQLite nằm trong `backend/Nova.Api/appsettings.json`. Database tương đối được tính từ content root của API. Có thể override bằng biến môi trường `ConnectionStrings__NovaDatabase`. Không commit database hoặc bí mật vào repository.

Migration `InitialCreate` đã có sẵn, khi clone chỉ chạy `tool restore` và `database update`. Sau khi sửa model, tạo migration có tên mới:

```bash
npm run dotnet -- ef migrations add TenThayDoi --project backend/Nova.Api
npm run dotnet -- ef migrations list --project backend/Nova.Api
npm run dotnet -- ef migrations has-pending-model-changes --project backend/Nova.Api
npm run db:update
```

Xem [hướng dẫn EF Core](backend/README.md) để hiểu provider, DbContext, khóa ngoại, Up/Down, snapshot và cấu hình kết nối.

## Triển khai và giới hạn

Vite dev/preview hỗ trợ SPA fallback. Vercel/Netlify config hiện có chỉ phục vụ **frontend tĩnh**, không tự triển khai ASP.NET Core/SQLite. GitHub repository lưu source, không tự chạy website.

Khi host riêng frontend, cấu hình `VITE_API_BASE_URL=https://dia-chi-api/api` lúc build và thêm origin frontend vào `Cors:AllowedOrigins` ở backend. Backend cần .NET 10 và ổ đĩa bền vững nếu dùng SQLite. Nếu tự host frontend với Nginx, dùng `try_files $uri $uri/ /index.html;` cho SPA.

API quản lý chưa có xác thực/phân quyền, phục vụ bài tập **cục bộ**. Cần thêm đăng nhập và quyền quản trị trước khi mở CRUD ra Internet. CORS không thay thế xác thực.

Backend chỉ lưu sản phẩm/danh mục; thanh toán, lưu đơn hàng, liên hệ và gửi email chưa triển khai. Giá, đánh giá, chính sách là dữ liệu học tập; hình SVG đại diện nhóm thiết bị. Giỏ hàng ở localStorage; mã ưu đãi và kết quả đơn demo ở sessionStorage. Giỏ cũ được giữ khi API đang tải/bị lỗi và lọc sản phẩm đã bị xóa khi tải thành công.

Font Be Vietnam Pro tải từ Google Fonts, có Arial dự phòng. Icon Lucide. Giữ nguyên giấy phép MIT sẵn có trong `LICENSE`.

## Tài liệu tham khảo

- [React](https://react.dev/)
- [Vite](https://vite.dev/guide/)
- [React Router](https://reactrouter.com/start/declarative/installation)
- [ASP.NET Core Web API](https://learn.microsoft.com/aspnet/core/tutorials/first-web-api)
- [EF Core với SQLite](https://learn.microsoft.com/ef/core/get-started/overview/first-app)
- [Axios](https://axios-http.com/docs/intro)
