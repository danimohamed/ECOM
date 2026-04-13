import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, createProduct, editProduct, deleteProduct } from '../../store/adminSlice';
import { formatPrice } from '../../utils/helpers';
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.admin);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [form, setForm] = useState({
    name: '', description: '', price: '', salePrice: '', category: 'upperwear',
    badge: '', materials: '', featured: false,
    sizes: JSON.stringify([
      { size: 'XS', stock: 0 }, { size: 'S', stock: 0 }, { size: 'M', stock: 0 },
      { size: 'L', stock: 0 }, { size: 'XL', stock: 0 }
    ]),
  });
  const [files, setFiles] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', salePrice: '', category: 'upperwear', badge: '', materials: '', featured: false, sizes: JSON.stringify([{ size: 'XS', stock: 0 }, { size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }, { size: 'XL', stock: 0 }]) });
    setFiles(null);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      salePrice: p.salePrice?.toString() || '',
      category: p.category,
      badge: p.badge || '',
      materials: p.materials || '',
      featured: p.featured,
      sizes: JSON.stringify(p.sizes),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'featured') formData.append(k, v ? 'true' : 'false');
      else formData.append(k, v);
    });
    if (files) {
      Array.from(files).forEach((f) => formData.append('images', f));
    }

    if (editId) {
      const res = await dispatch(editProduct({ id: editId, formData }));
      if (res.error) return toast.error(res.payload || 'Failed to update product');
      toast.success('Product updated');
    } else {
      const res = await dispatch(createProduct(formData));
      if (res.error) return toast.error(res.payload || 'Failed to create product');
      toast.success('Product created');
    }
    resetForm();
    dispatch(fetchAdminProducts());
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Products <span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>({products.items?.length || 0})</span></h1>
        <button className="btn btn-dark" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Product</button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiOutlineSearch size={16} />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="admin-filters">
          <div className="admin-filter-item">
            <HiOutlineFilter size={14} />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="upperwear">Upperwear</option>
              <option value="lowerwear">Lowerwear</option>
              <option value="flexgear">Flex Gear</option>
            </select>
          </div>
          <div className="admin-filter-item">
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
              <option value="all">All Stock</option>
              <option value="out">Out of Stock</option>
              <option value="low">Low Stock (≤5)</option>
              <option value="in">In Stock</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal-content" style={{ position: 'relative' }}>
            <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #ddd', borderRadius: 12, fontFamily: 'inherit', fontSize: 14 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Price (€)</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Sale Price (€)</label>
                  <input type="number" step="0.01" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="upperwear">Upperwear</option>
                    <option value="lowerwear">Lowerwear</option>
                    <option value="flexgear">Flex Gear</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Badge</label>
                  <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="BEST">BEST</option>
                    <option value="PRE-ORDER">PRE-ORDER</option>
                    <option value="SOLD OUT">SOLD OUT</option>
                    <option value="LIMITED">LIMITED</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Materials</label>
                <input type="text" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Sizes (JSON)</label>
                <textarea rows={3} value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #ddd', borderRadius: 12, fontFamily: 'monospace', fontSize: 12 }} />
              </div>
              <div className="form-group">
                <label>Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured Product
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-dark">{editId ? 'Update' : 'Create'}</button>
                <button type="button" className="btn btn-ghost" style={{ color: '#000', borderColor: '#000' }} onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Badge</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const filtered = (products.items || []).filter((p) => {
              const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
              const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
              const matchStock = stockFilter === 'all' ||
                (stockFilter === 'out' && p.totalStock === 0) ||
                (stockFilter === 'low' && p.totalStock > 0 && p.totalStock <= 5) ||
                (stockFilter === 'in' && p.totalStock > 5);
              return matchSearch && matchCategory && matchStock;
            });
            return filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 40 }}>No products found</td></tr>
            ) : filtered.map((p) => (
            <tr key={p._id}>
              <td style={{ fontWeight: 500 }}>{p.name}</td>
              <td>{p.category}</td>
              <td>
                {p.salePrice ? (
                  <><span style={{ fontWeight: 600 }}>{formatPrice(p.salePrice)}</span> <span style={{ textDecoration: 'line-through', color: '#999' }}>{formatPrice(p.price)}</span></>
                ) : formatPrice(p.price)}
              </td>
              <td>
                <span style={{ color: p.totalStock === 0 ? '#d32f2f' : p.totalStock <= 5 ? '#e6a817' : '#2a9d3a' }}>
                  {p.totalStock}
                </span>
              </td>
              <td>{p.badge && <span className={`status-badge ${p.badge === 'SOLD OUT' ? 'cancelled' : 'paid'}`}>{p.badge}</span>}</td>
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleEdit(p)} style={{ fontSize: 13, color: '#000', fontWeight: 600 }}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={{ fontSize: 13, color: '#d32f2f', fontWeight: 600 }}>Delete</button>
                </div>
              </td>
            </tr>
          ));
          })()}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;
