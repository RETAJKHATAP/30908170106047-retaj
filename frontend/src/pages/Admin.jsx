import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import { productApi, orderApi } from '../api/endpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = { name: '', description: '', price: '', category: '', brand: '', stock: '' };

export default function Admin() {
  const [tab, setTab] = useState('products');

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>

      <div className="mt-6 flex gap-2 border-b border-slate-200">
        <TabButton active={tab === 'products'} onClick={() => setTab('products')}>
          Products
        </TabButton>
        <TabButton active={tab === 'orders'} onClick={() => setTab('orders')}>
          Orders
        </TabButton>
      </div>

      <div className="mt-6">{tab === 'products' ? <ProductManager /> : <OrderManager />}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 px-4 py-2 text-sm font-semibold ${
        active ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    productApi
      .list({ limit: 50 })
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFiles([]);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
    });
    setFiles([]);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      files.forEach((file) => data.append('images', file));

      if (editingId) {
        await productApi.update(editingId, data);
      } else {
        await productApi.create(data);
      }

      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productApi.remove(id);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Manage Products</h2>
        <button onClick={openCreateForm} className="btn-primary">
          <Plus size={16} /> New product
        </button>
      </div>

      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card mt-4 space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? 'Edit product' : 'New product'}</h3>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              required
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Category"
              required
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              required
              className="input-field"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock"
              required
              className="input-field"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <input
              placeholder="Brand"
              className="input-field"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} />
          </div>

          <textarea
            placeholder="Description"
            required
            rows={3}
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create product'}
          </button>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3 text-slate-500">{p.category}</td>
                  <td className="py-3">${p.price.toFixed(2)}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => openEditForm(p)} className="mr-2 p-1.5 text-slate-500 hover:text-brand-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 text-slate-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    orderApi
      .all()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderApi.updateStatus(id, status);
      loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">All Orders</h2>
      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Order</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-3 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="py-3 text-slate-500">{order.user?.name || 'Unknown'}</td>
                <td className="py-3">${order.totalPrice.toFixed(2)}</td>
                <td className="py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="input-field !py-1.5 !text-xs"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
