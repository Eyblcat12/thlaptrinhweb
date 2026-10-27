import axios from 'axios';

// Vite proxy chuyển /api đến ASP.NET Core; production có thể dùng VITE_API_BASE_URL.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});
export const productsApi = {
  getAll: (signal) => api.get('/products', { signal }).then((r) => r.data),
  getById: (id) => api.get(`/products/${encodeURIComponent(id)}`).then((r) => r.data),
  create: (product) => api.post('/products', product).then((r) => r.data),
  update: (id, product) => api.put(`/products/${encodeURIComponent(id)}`, product),
  remove: (id) => api.delete(`/products/${encodeURIComponent(id)}`),
};
export const categoriesApi = {
  getAll: (signal) => api.get('/categories', { signal }).then((r) => r.data),
  create: (category) => api.post('/categories', category).then((r) => r.data),
  update: (id, category) => api.put(`/categories/${encodeURIComponent(id)}`, category),
  remove: (id) => api.delete(`/categories/${encodeURIComponent(id)}`),
};
export function apiError(error) {
  const problem = error.response?.data;
  if (problem?.errors) return Object.values(problem.errors).flat().join(' ');
  if (problem?.title) return problem.title;
  if (error.response?.status === 404) return 'Sản phẩm không còn tồn tại. Hãy tải lại danh sách.';
  return 'Không kết nối được API. Hãy chạy npm run api (cổng 5080), sau đó thử lại.';
}
