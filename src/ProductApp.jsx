import React, { useState } from 'react';
import './ProductApp.css'; // Import CSS baru

function ProductApp() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', desc: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  const resetForm = () => setNewProduct({ name: '', price: '', image: '', desc: '' });

  const validate = (obj) => {
    const priceValue = parseFloat(obj.price);
    if (!obj.name || isNaN(priceValue) || priceValue <= 0) {
      setError('Nama produk dan harga (lebih dari 0) harus diisi dengan benar.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!validate(newProduct)) return;

    const id = Date.now();
    const product = {
      id,
      name: newProduct.name.trim(),
      price: parseFloat(newProduct.price),
      image: newProduct.image.trim(),
      desc: newProduct.desc.trim(),
      createdAt: new Date().toISOString(),
    };

    setProducts(prev => [product, ...prev]);
    resetForm();
  };

  const handleStartEdit = (p) => {
    setEditingProduct({ ...p, price: String(p.price) });
    setError(null);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!validate(editingProduct)) return;

    setProducts(prev =>
      prev.map(p => (p.id === editingProduct.id
        ? { ...p, name: editingProduct.name.trim(), price: parseFloat(editingProduct.price), image: editingProduct.image?.trim() || '', desc: editingProduct.desc?.trim() || '' }
        : p))
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Hapus produk ini?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    if (editingProduct?.id === id) setEditingProduct(null);
  };

  const formatPrice = (n) => Number(n).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  // Helper untuk handle input change agar kode lebih ringkas
  const handleChange = (e, field) => {
    const val = e.target.value;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: val });
    } else {
      setNewProduct({ ...newProduct, [field]: val });
    }
  };

  const currentData = editingProduct || newProduct;

  return (
    <div className="app-container">
      <h1 className="header" style={{ marginBottom: 6 }}>Manajemen Produk</h1>
      <p style={{ marginTop: 0, color: '#4b5563' }}>Data sementara (Reset saat refresh)</p>

      {error && <div className="error-msg">{error}</div>}

      <div className="main-grid">
        {/* Form Section */}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>

          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
            <div className="form-row">
              <input
                className="input-field input-name"
                placeholder="Nama produk"
                value={currentData.name}
                onChange={(e) => handleChange(e, 'name')}
                required
              />
              <input
                className="input-field input-price"
                placeholder="Harga"
                type="number"
                step="0.01"
                value={currentData.price}
                onChange={(e) => handleChange(e, 'price')}
                required
              />
            </div>

            <input
              className="input-field input-full"
              placeholder="URL gambar (opsional)"
              value={currentData.image}
              onChange={(e) => handleChange(e, 'image')}
            />

            <textarea
              className="input-field input-full"
              placeholder="Deskripsi (opsional)"
              value={currentData.desc}
              onChange={(e) => handleChange(e, 'desc')}
              style={{ minHeight: 80 }}
            />

            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Simpan' : 'Tambah'}
              </button>
              {editingProduct ? (
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary">
                  Batal
                </button>
              ) : (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Summary Section */}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Ringkasan</h2>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{products.length}</div>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Total Produk Aktif</p>
        </div>
      </div>

      {/* Product List */}
      <div style={{ marginTop: 20 }}>
        <h2>Daftar Produk</h2>

        {products.length === 0 ? (
          <div style={{ padding: 18, borderRadius: 12, border: '1px dashed #e6eef8', color: '#6b7280' }}>
            Belum ada produk. Silakan tambah data baru.
          </div>
        ) : (
          <div className="product-list">
            {products.map((p) => (
              <div key={p.id} className="product-item">
                <div className="product-img">
                  {p.image ? (
                    <img src={p.image} alt={p.name} onError={(e)=>{e.currentTarget.style.display='none'}} />
                  ) : (
                    <span style={{ fontSize: 24 }}>📦</span>
                  )}
                </div>

                <div className="product-info">
                  <div className="product-header">
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0b4a7a' }}>Rp {formatPrice(p.price)}</div>
                  </div>
                  
                  {p.desc && <div style={{ marginTop: 4, color: '#374151', fontSize: '0.9em' }}>{p.desc}</div>}

                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button onClick={() => handleStartEdit(p)} className="btn btn-edit" style={{ padding: '6px 12px', fontSize: '0.9em' }}>Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.9em' }}>Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductApp;