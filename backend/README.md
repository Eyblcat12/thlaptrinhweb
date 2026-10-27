# NOVA API — ASP.NET Core, Axios và EF Core

## Project và cách chạy

`Nova.Api` dùng ASP.NET Core **controllers**, .NET 10, EF Core **10.0.14** và SQLite. Database là file cục bộ, không cần cài SQL Server. Từ thư mục **gốc repository**:

```bash
npm ci
npm run dotnet -- restore backend/Nova.Api
npm run dotnet -- tool restore
npm run db:update
npm run api
```

Chạy `npm run dev` trong terminal khác. Frontend: `http://localhost:3000`; API: `http://localhost:5080`; quản lý: `http://localhost:3000/admin/products`.

`npm run dotnet -- ...` là CLI .NET, chọn SDK `.tools/dotnet/` nếu có. Máy khác cần cài **.NET 10 SDK**, sau đó dùng script hoặc `dotnet` trực tiếp. `global.json` cho phép chọn các feature band .NET 10 mới hơn.

Trong Development, API gọi `Database.MigrateAsync()` rồi seed dữ liệu mẫu **một lần**. Bảng `SeedStates` đánh dấu đã seed, kể cả sau khi xóa hết sản phẩm/danh mục. `dotnet ef database update` tạo schema; seed mẫu được nạp khi API chạy lần đầu ở Development.

## Controllers và endpoint

| Method | Endpoint               | Thành công                      |
| ------ | ---------------------- | ------------------------------- |
| GET    | `/api/products`        | 200, danh sách                  |
| GET    | `/api/products/{id}`   | 200, chi tiết                   |
| POST   | `/api/products`        | 201, sản phẩm mới và `Location` |
| PUT    | `/api/products/{id}`   | 204, cập nhật                   |
| DELETE | `/api/products/{id}`   | 204, xóa                        |
| GET    | `/api/categories`      | 200, danh sách danh mục         |
| GET    | `/api/categories/{id}` | 200, chi tiết danh mục          |
| POST   | `/api/categories`      | 201, danh mục mới và `Location` |
| PUT    | `/api/categories/{id}` | 204, cập nhật danh mục          |
| DELETE | `/api/categories/{id}` | 204, xóa danh mục rỗng          |
| GET    | `/api/health`          | 200 khi kết nối SQLite được     |

`[ApiController]` kiểm tra DataAnnotations và trả **400** cho request sai. **404** nghĩa là mã không tồn tại; **409** là mã trùng hoặc danh mục vẫn chứa sản phẩm. Lỗi dùng `ProblemDetails` / `ValidationProblemDetails`.

Mã sản phẩm là slug bất biến: chữ thường, số, dấu gạch ngang giữa các từ. Mã body PUT phải khớp URL. Giá là số nguyên VND từ 1 đến 1.000.000.000; giá gốc không thấp hơn giá bán. Chỉ nhận tên hình SVG có sẵn, màu hex và thông số giới hạn độ dài. DTO riêng không cho client gửi navigation entity hay trường nội bộ.

Development cung cấp OpenAPI JSON tại `/openapi/v1.json`, có thể import vào Postman; chưa cài Swagger UI. File [`Nova.Api.http`](Nova.Api/Nova.Api.http) có sẵn request GET/POST/PUT/DELETE, chạy bằng REST Client hoặc công cụ hỗ trợ `.http`.

## Axios ở frontend

`src/services/api.js` tạo instance dùng chung:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

api.get('/products'); // GET danh sách
api.get(`/products/${id}`); // GET trước khi sửa
api.post('/products', product); // POST thêm
api.put(`/products/${id}`, product); // PUT sửa
api.delete(`/products/${id}`); // DELETE xóa
```

`ShopProvider` tải sản phẩm/danh mục rồi cung cấp cho trang chủ, danh sách, chi tiết, giỏ và quản lý. `ManageProducts` gọi POST/PUT/DELETE thật rồi GET lại danh sách. Giỏ dùng giá API hiện hành, không dùng mảng sản phẩm cứng.

Frontend có loading, lỗi kết nối, thử lại, validation và hộp thoại xác nhận xóa. Nếu API lỗi, không giả vờ lưu thành công hoặc chuyển sang dữ liệu mẫu. API categories cũng có đủ hàm Axios CRUD; giao diện hiện CRUD sản phẩm và đọc danh mục vào dropdown.

Vite proxy `/api` đến `http://127.0.0.1:5080`, áp dụng cho cả dev và preview. Khi host frontend riêng, dùng `VITE_API_BASE_URL` theo `.env.example`. Biến `VITE_*` được nhúng lúc build, không dùng để chứa bí mật. Backend chỉ cho CORS từ các origin được cấu hình.

## Kết nối database

`Nova.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "NovaDatabase": "Data Source=App_Data/nova.db;Foreign Keys=True"
  }
}
```

`Program.cs` lấy connection string bằng `GetConnectionString("NovaDatabase")`, chuẩn hóa đường dẫn từ content root của API rồi đăng ký:

```csharp
builder.Services.AddDbContext<NovaDbContext>(options =>
    options.UseSqlite(connection.ConnectionString));
```

Có thể override bằng biến môi trường `ConnectionStrings__NovaDatabase`. Database, WAL/SHM và `.tools` được gitignore. Source lưu migration và JSON seed, không lưu database phát sinh.

`NovaDbContext` quản lý Product, Category, SeedState. Quan hệ **một Category → nhiều Product** có khóa ngoại `CategoryId` và `DeleteBehavior.Restrict`, không cho xóa danh mục đang dùng. `Specs` là dictionary chuyển thành JSON TEXT qua value converter; `ValueComparer` giúp EF nhận biết thay đổi. Giá dùng `long` để lưu số nguyên VND.

Nếu chuyển sang SQL Server: cài `Microsoft.EntityFrameworkCore.SqlServer`, thay `UseSqlite` bằng `UseSqlServer`, cấu hình connection string và tạo **bộ migration riêng cho SQL Server**. Không dùng nguyên migration SQLite cho provider khác. Nếu có mật khẩu kết nối, dùng biến môi trường hoặc .NET User Secrets, không commit bí mật.

## EF Core và migration — Code First

Package đã khai báo trong `.csproj`; restore sẽ tải. Các lệnh thiết lập tương đương:

```bash
dotnet add backend/Nova.Api package Microsoft.EntityFrameworkCore.Sqlite --version 10.0.14
dotnet add backend/Nova.Api package Microsoft.EntityFrameworkCore.Design --version 10.0.14
dotnet tool restore
```

`dotnet-ef` 10.0.14 được pin trong `.config/dotnet-tools.json`, không cần cài global. Quy trình: **Model → DbContext → Migration → Database**.

Migration đầu tiên đã được sinh và commit bằng:

```bash
dotnet ef migrations add InitialCreate --project backend/Nova.Api --output-dir Migrations
dotnet ef database update --project backend/Nova.Api
```

Khi clone, **không tạo lại InitialCreate**; chỉ restore tool và update database. `Up()` thêm bảng/cột/chỉ mục, `Down()` đảo ngược thay đổi. Model snapshot dùng để so sánh model cho lần sinh migration sau. Bảng `__EFMigrationsHistory` ghi các migration đã áp dụng.

Khi sửa model, tạo migration có tên mới, xem nội dung trước khi update:

```bash
npm run dotnet -- ef migrations add TenThayDoi --project backend/Nova.Api
npm run dotnet -- ef migrations list --project backend/Nova.Api
npm run dotnet -- ef migrations has-pending-model-changes --project backend/Nova.Api
npm run db:update
```

Project không dùng `EnsureCreated()` vì quản lý schema bằng migration. Production mặc định `Database:ApplyMigrationsOnStartup=false`; chạy migration riêng sau khi review và sao lưu dữ liệu cần thiết. Development mới tự apply và seed theo cấu hình hiện tại.

## Kiểm thử và trình bày

```bash
npm test
npm run build
npm run api:build
npm run test:api
```

`test:api` chạy Kestrel thật trên cổng trống, tạo database SQLite riêng trong `.tools/api-test-*`, gửi HTTP bằng Axios, khởi động lại API để kiểm tra dữ liệu bền vững. Nó không sử dụng `App_Data/nova.db`. Test gồm CRUD cả hai controller, validation, khóa ngoại, CORS, OpenAPI, và không seed lại dữ liệu đã xóa.

Trình bày: mở **Quản lý**, tạo sản phẩm có mã riêng, sửa tên/giá, xem giá mới ở cửa hàng và giỏ, rồi xóa sản phẩm thử nghiệm. DevTools → Network → lọc `api/products` để xem GET/POST/PUT/DELETE cùng status code.

## Giới hạn

API CRUD chưa có xác thực/phân quyền, phục vụ bài tập trên máy cá nhân và mặc định lắng nghe loopback. CORS không thay thế đăng nhập/phân quyền. Trước khi mở API quản lý ra Internet cần bổ sung xác thực và quyền quản trị.

Checkout, liên hệ và nhận tin vẫn là frontend demo; không lưu đơn hàng, thanh toán hoặc gửi email thật. Backend chỉ nhận dữ liệu sản phẩm/danh mục, không nhận dữ liệu cá nhân từ các form đó.

## Tài liệu chính thức

- [ASP.NET Core Web API](https://learn.microsoft.com/aspnet/core/tutorials/first-web-api)
- [EF Core với SQLite](https://learn.microsoft.com/ef/core/get-started/overview/first-app)
- [Quản lý migration](https://learn.microsoft.com/ef/core/managing-schemas/migrations/)
- [Connection strings](https://learn.microsoft.com/ef/core/miscellaneous/connection-strings)
- [Axios](https://axios-http.com/docs/intro)
