// Hàm hiển thị dùng chung; sản phẩm và danh mục được tải từ ASP.NET Core API.
export const money = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
export const discount = (p) => Math.round((1 - p.price / p.originalPrice) * 100);
export const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase();
