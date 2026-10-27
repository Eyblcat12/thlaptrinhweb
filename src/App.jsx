import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import { Checkout, OrderSuccess } from './pages/Checkout';
import NotFound from './pages/NotFound';
import ManageProducts from './pages/ManageProducts';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titles = {
      '/': 'Công nghệ cho chất riêng',
      '/products': 'Khám phá sản phẩm',
      '/deals': 'Ưu đãi hôm nay',
      '/about-us': 'Câu chuyện NOVA',
      '/contact': 'Liên hệ',
      '/cart': 'Giỏ hàng',
      '/checkout': 'Đặt hàng mô phỏng',
      '/order-success': 'Đặt hàng thành công',
      '/admin/products': 'Quản lý sản phẩm',
    };
    document.title = `${titles[pathname] || 'Khám phá công nghệ'} | NOVA`;
  }, [pathname]);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="admin/products" element={<ManageProducts />} />
        <Route path="deals" element={<Products deals />} />
        <Route path="about-us" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
