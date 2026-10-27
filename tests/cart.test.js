import test from 'node:test';
import assert from 'node:assert/strict';
import { addItem, cartTotals, sanitizeCart } from '../src/lib/cart.js';
import { normalize } from '../src/data/products.js';
import products from '../backend/Nova.Api/Data/Seed/products.json' with { type: 'json' };

test('Tìm kiếm tiếng Việt không dấu và chữ hoa', () => {
  assert.equal(normalize('ĐIỆN THOẠI'), 'dien thoai');
  assert.equal(normalize('Điện thoại'), normalize('dien thoai'));
});

test('Thêm sản phẩm, tăng số lượng và giới hạn 10 sản phẩm', () => {
  let cart = addItem([], products[0].id, products);
  assert.deepEqual(cart, [{ id: products[0].id, quantity: 1 }]);
  for (let i = 0; i < 20; i++) cart = addItem(cart, products[0].id, products);
  assert.equal(cart[0].quantity, 10);
  assert.equal(addItem(cart, 'invalid-id', products), cart);
});

test('Lọc dữ liệu giỏ hàng hỏng, trùng hoặc không còn tồn tại', () => {
  const id = products[0].id;
  assert.deepEqual(sanitizeCart(null), []);
  assert.deepEqual(
    sanitizeCart(
      [
        { id, quantity: 100 },
        { id, quantity: 2 },
        { id: 'missing', quantity: 1 },
        null,
        { id: products[1].id, quantity: -1 },
        { id: products[2].id, quantity: '2' },
      ],
      products,
    ),
    [{ id, quantity: 10 }],
  );
});

test('Miễn phí vận chuyển từ 2 triệu và tính phí cho đơn thấp hơn', () => {
  const p = products.find((item) => item.price < 2000000);
  assert.equal(cartTotals([{ id: p.id, quantity: 1 }], '', products).shipping, 30000);
  assert.equal(cartTotals([{ id: products[0].id, quantity: 1 }], '', products).shipping, 0);
  assert.deepEqual(cartTotals([]), { subtotal: 0, discountAmount: 0, shipping: 0, total: 0 });
});

test('NOVA10 giảm đúng 10%, tối đa 500.000đ và không áp dụng mã sai', () => {
  const smallCart = [{ id: 'logitech-pebble-2', quantity: 1 }];
  assert.equal(cartTotals(smallCart, 'NOVA10', products).discountAmount, 59000);
  assert.equal(cartTotals(smallCart, 'NOVA10', products).total, 561000);
  assert.equal(
    cartTotals([{ id: products[0].id, quantity: 2 }], 'NOVA10', products).discountAmount,
    500000,
  );
  assert.equal(cartTotals(smallCart, 'BADCODE', products).discountAmount, 0);
});

test('Giữ giỏ khi API chưa tải và tính tiền theo giá hiện hành từ database', () => {
  const saved = [{ id: 'custom-api-product', quantity: 2 }];
  assert.deepEqual(sanitizeCart(saved), saved);
  assert.deepEqual(sanitizeCart(saved, []), []);
  assert.equal(
    cartTotals(saved, '', [{ id: 'custom-api-product', price: 2000000 }]).total,
    4000000,
  );
});
