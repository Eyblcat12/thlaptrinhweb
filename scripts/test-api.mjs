import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import axios from 'axios';
import { dotnetCommand, dotnetEnv, root } from './dotnet-runtime.mjs';

// Chạy API thật với SQLite riêng, không sửa/xóa database của cửa hàng.
const apiRoot = join(root, 'backend', 'Nova.Api');
const dll = join(apiRoot, 'bin', 'Debug', 'net10.0', 'Nova.Api.dll');
if (!existsSync(dll)) throw new Error('Chạy npm run api:build trước npm run test:api.');
await mkdir(join(root, '.tools'), { recursive: true });
const testDirectory = await mkdtemp(join(root, '.tools', 'api-test-'));
const portServer = createServer();
await new Promise((resolve, reject) => {
  portServer.once('error', reject);
  portServer.listen(0, '127.0.0.1', resolve);
});
const port = portServer.address().port;
await new Promise((resolve) => portServer.close(resolve));
const url = `http://127.0.0.1:${port}`;
const http = axios.create({
  baseURL: url,
  timeout: 3000,
  proxy: false,
  validateStatus: () => true,
});
let processApi;
let output = '';
async function start() {
  processApi = spawn(dotnetCommand, [dll, '--urls', url], {
    cwd: apiRoot,
    env: {
      ...dotnetEnv,
      ASPNETCORE_ENVIRONMENT: 'Development',
      ConnectionStrings__NovaDatabase: `Data Source=${join(testDirectory, 'test.db')};Foreign Keys=True`,
      Database__ApplyMigrationsOnStartup: 'true',
      Logging__LogLevel__Default: 'Warning',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let launchError;
  processApi.on('error', (error) => {
    launchError = error;
  });
  processApi.stdout.on('data', (data) => {
    output += data;
  });
  processApi.stderr.on('data', (data) => {
    output += data;
  });
  for (let attempt = 0; attempt < 150; attempt++) {
    if (launchError) throw launchError;
    if (processApi.exitCode !== null) throw new Error(`API đã dừng: ${output}`);
    try {
      if ((await http.get('/api/health')).status === 200) return;
    } catch {
      /* Chờ Kestrel khởi động. */
    }
    await delay(200);
  }
  throw new Error(`API không khởi động kịp: ${output}`);
}
async function stop() {
  if (!processApi || processApi.exitCode !== null) return;
  await new Promise((resolve) => {
    processApi.once('exit', resolve);
    processApi.kill();
  });
}
let passed = 0;
function pass(message) {
  passed++;
  console.log(`✓ ${message}`);
}
try {
  await start();
  const initial = await http.get('/api/products');
  assert.equal(initial.status, 200);
  assert.equal(initial.data.length, 12);
  assert.equal((await http.get('/api/categories')).data.length, 5);
  pass('Migration tạo database mới và seed 12 sản phẩm / 5 danh mục');
  const document = await http.get('/openapi/v1.json');
  assert.equal(document.status, 200);
  assert.ok(document.data.paths['/api/products'].post);
  assert.ok(document.data.paths['/api/products/{id}'].put);
  pass('OpenAPI có tài liệu các endpoint controller');
  const allowed = await http.options('/api/products', {
    headers: { Origin: 'http://localhost:3000', 'Access-Control-Request-Method': 'PUT' },
  });
  assert.equal(allowed.headers['access-control-allow-origin'], 'http://localhost:3000');
  const denied = await http.options('/api/products', {
    headers: { Origin: 'https://untrusted.example', 'Access-Control-Request-Method': 'POST' },
  });
  assert.equal(denied.headers['access-control-allow-origin'], undefined);
  pass('CORS chỉ cho các origin frontend đã cấu hình');

  const category = { id: 'api-test', name: 'Danh mục kiểm tra', icon: 'grid', sortOrder: 10 };
  const catResponse = await http.post('/api/categories', category);
  assert.equal(catResponse.status, 201);
  assert.ok(catResponse.headers.location.endsWith('/api/categories/api-test'));
  assert.equal((await http.post('/api/categories', category)).status, 409);
  pass('POST danh mục trả 201, Location; mã trùng trả 409');
  const product = {
    ...initial.data[0],
    id: 'api-test-product',
    name: 'Sản phẩm kiểm tra Axios',
    category: category.id,
    price: 2000000,
    originalPrice: 2500000,
  };
  const created = await http.post('/api/products', product);
  assert.equal(created.status, 201);
  assert.ok(created.headers.location.endsWith('/api/products/api-test-product'));
  assert.equal((await http.get('/api/products/api-test-product')).data.price, 2000000);
  assert.equal((await http.post('/api/products', product)).status, 409);
  pass('POST + GET sản phẩm, chống trùng mã');
  assert.equal(
    (await http.post('/api/products', { ...product, id: 'bad-price', price: -1 })).status,
    400,
  );
  assert.equal(
    (await http.post('/api/products', { ...product, id: 'bad-original-price', price: 3000000 }))
      .status,
    400,
  );
  assert.equal(
    (await http.post('/api/products', { ...product, id: 'bad-category', category: 'missing' }))
      .status,
    400,
  );
  assert.equal(
    (await http.post('/api/products', { ...product, id: 'bad-art', art: '../../private' })).status,
    400,
  );
  assert.equal(
    (await http.post('/api/products', { ...product, id: 'bad-specs', specs: { '': 'invalid' } }))
      .status,
    400,
  );
  pass('Validation 400 cho giá, giá gốc, danh mục, hình và thông số sai');
  product.price = 1250000;
  product.name = 'Sản phẩm đã cập nhật';
  assert.equal((await http.put('/api/products/api-test-product', product)).status, 204);
  assert.equal((await http.get('/api/products/api-test-product')).data.name, product.name);
  assert.equal((await http.put('/api/products/wrong-id', product)).status, 400);
  assert.equal(
    (await http.put('/api/products/missing', { ...product, id: 'missing' })).status,
    404,
  );
  assert.equal((await http.delete('/api/products/missing')).status, 404);
  pass('PUT lưu thay đổi; URL lệch mã trả 400, mã không tồn tại trả 404');
  assert.equal((await http.delete('/api/categories/api-test')).status, 409);
  pass('Khóa ngoại ngăn xóa danh mục đang chứa sản phẩm');
  await stop();
  await start();
  assert.equal((await http.get('/api/products/api-test-product')).data.price, 1250000);
  pass('Dữ liệu SQLite còn nguyên sau khi khởi động lại API');
  assert.equal((await http.delete('/api/products/api-test-product')).status, 204);
  assert.equal((await http.get('/api/products/api-test-product')).status, 404);
  assert.equal(
    (await http.put('/api/categories/api-test', { ...category, name: 'Đã cập nhật danh mục' }))
      .status,
    204,
  );
  assert.equal((await http.get('/api/categories/api-test')).data.name, 'Đã cập nhật danh mục');
  assert.equal((await http.delete('/api/categories/api-test')).status, 204);
  assert.equal((await http.get('/api/categories/api-test')).status, 404);
  pass('DELETE sản phẩm và PUT/GET/DELETE danh mục hoạt động');
  // Chỉ xóa seed trong DB kiểm tra đã tạo ở trên để kiểm tra không tự seed lại.
  for (const p of (await http.get('/api/products')).data)
    assert.equal((await http.delete(`/api/products/${p.id}`)).status, 204);
  for (const c of (await http.get('/api/categories')).data)
    assert.equal((await http.delete(`/api/categories/${c.id}`)).status, 204);
  await stop();
  await start();
  assert.equal((await http.get('/api/products')).data.length, 0);
  assert.equal((await http.get('/api/categories')).data.length, 0);
  pass('Không tự khôi phục dữ liệu đã xóa khi khởi động lại');
  console.log(`\n${passed}/${passed} nhóm kiểm tra API đạt. Database test: ${testDirectory}`);
} catch (error) {
  console.error(error);
  if (output) console.error(output.slice(-5000));
  process.exitCode = 1;
} finally {
  await stop();
}
