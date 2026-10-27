import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import Breadcrumb from '../components/Breadcrumb';
import CatalogStatus from '../components/CatalogStatus';
import Icon from '../components/Icon';
import { useShop } from '../context/shop';
import { money, normalize } from '../data/products';
import { apiError, productsApi } from '../services/api';

const emptyProduct = {
  id: '',
  name: '',
  category: '',
  brand: '',
  subtitle: '',
  price: '',
  originalPrice: '',
  rating: 0,
  reviews: 0,
  color: '',
  art: 'headphones',
  background: '#efeee9',
  badge: '',
  specs: {},
};
const artOptions = {
  headphones: 'Tai nghe chụp tai',
  phone: 'Điện thoại',
  laptop: 'Laptop',
  watch: 'Đồng hồ',
  earbuds: 'Tai nghe nhét tai',
  mouse: 'Chuột',
};

function DeleteDialog({ product, busy, error, onCancel, onConfirm }) {
  const dialog = useRef(null);
  useEffect(() => {
    dialog.current.showModal();
  }, []);
  return (
    <dialog
      className="delete-dialog"
      ref={dialog}
      aria-labelledby="delete-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <span className="dialog-icon">
        <Icon name="trash" size={26} />
      </span>
      <h2 id="delete-title">Xóa sản phẩm này?</h2>
      <p>
        <b>{product.name}</b> sẽ được xóa khỏi database và danh sách bán hàng.
      </p>
      <p className="demo-note">Thao tác này không có nút hoàn tác.</p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="dialog-actions">
        <button className="button button-outline" disabled={busy} onClick={onCancel}>
          Giữ lại
        </button>
        <button className="button button-danger" disabled={busy} onClick={onConfirm}>
          {busy ? 'Đang xóa…' : 'Xóa sản phẩm'}
        </button>
      </div>
    </dialog>
  );
}

export default function ManageProducts() {
  const { products, categories, loading, error, reloadCatalog, notify } = useShop();
  const [form, setForm] = useState({ ...emptyProduct });
  const [editing, setEditing] = useState(null);
  const [specText, setSpecText] = useState('');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const nameInput = useRef(null);
  const groups = categories.filter((c) => c.id !== 'all');
  const filtered = products.filter((p) =>
    normalize(`${p.name} ${p.id} ${p.brand}`).includes(normalize(query)),
  );
  function change(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  }
  function reset() {
    setEditing(null);
    setForm({ ...emptyProduct });
    setSpecText('');
    setFormError('');
  }
  async function edit(id) {
    setBusy(true);
    setFormError('');
    try {
      // GET /api/products/{id}: lấy bản hiện hành trước khi chỉnh sửa.
      const product = await productsApi.getById(id);
      setForm(product);
      setEditing(id);
      setSpecText(
        Object.entries(product.specs)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n'),
      );
      requestAnimationFrame(() => {
        nameInput.current?.focus();
        nameInput.current?.scrollIntoView({ block: 'center' });
      });
    } catch (failure) {
      setFormError(apiError(failure));
    } finally {
      setBusy(false);
    }
  }
  async function save(e) {
    e.preventDefault();
    if (busy) return;
    setFormError('');
    const specs = Object.create(null);
    for (const line of specText.split('\n').filter((line) => line.trim())) {
      const split = line.indexOf(':');
      const key = line.slice(0, split).trim();
      const value = line.slice(split + 1).trim();
      if (split < 1 || !key || !value || Object.hasOwn(specs, key)) {
        setFormError('Mỗi thông số dùng một dòng Tên: Giá trị; tên thông số không được trùng.');
        return;
      }
      specs[key] = value;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      specs,
    };
    if (payload.originalPrice < payload.price) {
      setFormError('Giá gốc phải lớn hơn hoặc bằng giá bán.');
      return;
    }
    setBusy(true);
    try {
      if (editing)
        await productsApi.update(editing, payload); // PUT
      else await productsApi.create(payload); // POST
      notify(editing ? 'Đã cập nhật sản phẩm trong database.' : 'Đã thêm sản phẩm vào database.');
      reset();
      await reloadCatalog(); // GET: đồng bộ toàn bộ cửa hàng với dữ liệu mới.
    } catch (failure) {
      setFormError(apiError(failure));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (busy) return;
    setBusy(true);
    setDeleteError('');
    try {
      await productsApi.remove(deleteTarget.id); // DELETE
      if (editing === deleteTarget.id) reset();
      setDeleteTarget(null);
      notify('Đã xóa sản phẩm khỏi database.');
      await reloadCatalog();
    } catch (failure) {
      setDeleteError(apiError(failure));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container page-content manage-page">
      <Breadcrumb items={[{ label: 'Quản lý sản phẩm' }]} />
      <div className="page-heading manage-heading">
        <div>
          <span className="eyebrow">NOVA · KHÔNG GIAN QUẢN LÝ</span>
          <h1>
            Sản phẩm của cửa hàng<span className="heading-dot">.</span>
          </h1>
          <p>Thêm, chỉnh sửa và quản lý danh mục hàng bán tại một nơi.</p>
        </div>
        <Link className="text-link" to="/products">
          Xem cửa hàng <Icon name="arrowUp" size={18} />
        </Link>
      </div>
      <div className="demo-banner">
        <Icon name="shield" size={22} />
        <p>
          <b>Trang thực hành trên máy cá nhân.</b> Dữ liệu sản phẩm được lưu thật trong SQLite. Các
          API quản lý chưa có đăng nhập, chỉ dùng cục bộ cho bài tập.
        </p>
      </div>
      <CatalogStatus />
      <div className="manage-layout">
        <section className="manage-list" aria-label="Quản lý danh sách sản phẩm">
          <div className="manage-toolbar">
            <h2>
              Danh sách <span>{products.length}</span>
            </h2>
            <button
              className="text-link inline-button"
              disabled={busy || loading}
              onClick={reloadCatalog}
            >
              <Icon name="rotate" size={16} /> Tải lại
            </button>
          </div>
          <div className="catalog-search">
            <Icon name="search" size={18} />
            <input
              aria-label="Tìm sản phẩm quản lý"
              placeholder="Tìm theo tên, mã hoặc thương hiệu…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="manage-table-wrap">
            <table className="manage-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá bán</th>
                  <th>
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="manage-product">
                        <img
                          src={`/images/${p.art}.svg`}
                          alt=""
                          width="55"
                          height="55"
                          style={{ background: p.background }}
                        />
                        <div>
                          <Link to={`/products/${p.id}`}>{p.name}</Link>
                          <span>
                            {groups.find((c) => c.id === p.category)?.name} · {p.brand}
                          </span>
                          <small>{p.id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="manage-price">{money(p.price)}</td>
                    <td>
                      <div className="manage-actions">
                        <button
                          disabled={busy || loading || !!error}
                          onClick={() => edit(p.id)}
                          aria-label={`Sửa ${p.name}`}
                        >
                          Sửa
                        </button>
                        <button
                          disabled={busy || loading || !!error}
                          className="delete-link"
                          onClick={() => {
                            setDeleteTarget(p);
                            setDeleteError('');
                          }}
                          aria-label={`Xóa ${p.name}`}
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && !error && !filtered.length && (
            <div className="empty-state">
              <Icon name="package" size={35} />
              <h3>{products.length ? 'Không có kết quả phù hợp' : 'Chưa có sản phẩm'}</h3>
              <p>
                {products.length
                  ? 'Thử tìm bằng tên hoặc mã khác.'
                  : 'Thêm sản phẩm đầu tiên bằng biểu mẫu bên cạnh.'}
              </p>
            </div>
          )}
        </section>
        <section className="form-card manage-form" aria-labelledby="product-form-title">
          <div className="manage-form-title">
            <h2 id="product-form-title">{editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            {editing && (
              <button className="text-link inline-button" disabled={busy} onClick={reset}>
                Hủy sửa
              </button>
            )}
          </div>
          <p className="form-intro">
            {editing
              ? 'Mã sản phẩm được giữ cố định để các liên kết tiếp tục hoạt động.'
              : 'Điền thông tin để sản phẩm xuất hiện trên cửa hàng.'}
          </p>
          <form onSubmit={save}>
            <fieldset disabled={busy || loading || !!error}>
              <div className="form-grid">
                <label className="full-width">
                  Tên sản phẩm *
                  <input
                    ref={nameInput}
                    name="name"
                    required
                    minLength={2}
                    maxLength={160}
                    value={form.name}
                    onChange={change}
                    placeholder="Ví dụ: Tai nghe NOVA Studio"
                  />
                </label>
                <label className="full-width">
                  Mã sản phẩm (không dấu) *
                  <input
                    name="id"
                    required
                    maxLength={80}
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    title="Chỉ chữ thường không dấu, số và dấu gạch ngang giữa các từ"
                    disabled={!!editing}
                    value={form.id}
                    onChange={change}
                    placeholder="tai-nghe-nova-studio"
                  />
                </label>
                <label>
                  Danh mục *
                  <select name="category" value={form.category} required onChange={change}>
                    <option value="" disabled>
                      Chọn danh mục
                    </option>
                    {groups.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Thương hiệu *
                  <input
                    name="brand"
                    required
                    maxLength={80}
                    value={form.brand}
                    onChange={change}
                    placeholder="NOVA"
                  />
                </label>
                <label>
                  Giá bán (VND) *
                  <input
                    name="price"
                    required
                    type="number"
                    min="1"
                    max="1000000000"
                    step="1"
                    value={form.price}
                    onChange={change}
                    placeholder="1490000"
                  />
                </label>
                <label>
                  Giá gốc (VND) *
                  <input
                    name="originalPrice"
                    required
                    type="number"
                    min="1"
                    max="1000000000"
                    step="1"
                    value={form.originalPrice}
                    onChange={change}
                    placeholder="1990000"
                  />
                </label>
                <label>
                  Màu sắc
                  <input
                    name="color"
                    maxLength={80}
                    value={form.color}
                    onChange={change}
                    placeholder="Đen"
                  />
                </label>
                <label>
                  Hình minh họa
                  <select name="art" value={form.art} onChange={change}>
                    {Object.entries(artOptions).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Nhãn sản phẩm
                  <input
                    name="badge"
                    maxLength={40}
                    value={form.badge}
                    onChange={change}
                    placeholder="Mới về"
                  />
                </label>
                <label>
                  Màu nền minh họa
                  <input name="background" type="color" value={form.background} onChange={change} />
                </label>
                <label className="full-width">
                  Mô tả ngắn
                  <textarea
                    name="subtitle"
                    maxLength={300}
                    rows="2"
                    value={form.subtitle}
                    onChange={change}
                    placeholder="Một trải nghiệm mới cho mỗi ngày."
                  />
                </label>
                <label className="full-width">
                  Thông số nổi bật
                  <textarea
                    rows="4"
                    value={specText}
                    onChange={(e) => setSpecText(e.target.value)}
                    placeholder={'Kết nối: Bluetooth 5.3\nThời lượng pin: 30 giờ'}
                  />
                  <small>Mỗi dòng theo dạng Tên: Giá trị. Tối đa 20 thông số.</small>
                </label>
              </div>
              {formError && (
                <p role="alert" className="form-error">
                  {formError}
                </p>
              )}
              <button type="submit" className="button button-dark manage-save">
                {busy ? 'Đang lưu…' : editing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                <Icon name={editing ? 'check' : 'plus'} size={18} />
              </button>
            </fieldset>
          </form>
        </section>
      </div>
      {deleteTarget && (
        <DeleteDialog
          product={deleteTarget}
          busy={busy}
          error={deleteError}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={remove}
        />
      )}
    </div>
  );
}
