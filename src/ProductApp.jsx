import React, { useState } from 'react';

// Versi lokal: semua data disimpan hanya di memori (useState).
// Refresh halaman akan menghapus semua data.

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

    const id = Date.now(); // id sederhana
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
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    if (editingProduct && editingProduct.id === id) setEditingProduct(null);
  };

  const formatPrice = (n) => Number(n).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', padding: 20, maxWidth: 980, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 6 }}>Manajemen Produk (Cache Sementara)</h1>
      <p style={{ marginTop: 0, color: '#4b5563' }}>Data hanya di memori. Refresh akan menghapus semua.</p>

      {error && <div style={{ color: 'white', background: '#ef4444', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(12,18,30,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>

          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                placeholder="Nama produk"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChange={(e) => editingProduct
                  ? setEditingProduct({ ...editingProduct, name: e.target.value })
                  : setNewProduct({ ...newProduct, name: e.target.value })}
                style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e6eef8' }}
                required
              />
              <input
                placeholder="Harga"
                type="number"
                step="0.01"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => editingProduct
                  ? setEditingProduct({ ...editingProduct, price: e.target.value })
                  : setNewProduct({ ...newProduct, price: e.target.value })}
                style={{ width: 140, padding: 10, borderRadius: 8, border: '1px solid #e6eef8' }}
                required
              />
            </div>

            <input
              placeholder="URL gambar (opsional)"
              value={editingProduct ? editingProduct.image : newProduct.image}
              onChange={(e) => editingProduct
                ? setEditingProduct({ ...editingProduct, image: e.target.value })
                : setNewProduct({ ...newProduct, image: e.target.value })}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6eef8', marginBottom: 8 }}
            />

            <textarea
              placeholder="Deskripsi (opsional)"
              value={editingProduct ? editingProduct.desc : newProduct.desc}
              onChange={(e) => editingProduct
                ? setEditingProduct({ ...editingProduct, desc: e.target.value })
                : setNewProduct({ ...newProduct, desc: e.target.value })}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6eef8', minHeight: 80 }}
            />

            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '10px 14px', borderRadius: 8, background: '#2563eb', color: 'white', border: 'none' }}>
                {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
              {editingProduct ? (
                <button type="button" onClick={() => setEditingProduct(null)} style={{ padding: '10px 14px', borderRadius: 8 }}>
                  Batal Edit
                </button>
              ) : (
                <button type="button" onClick={resetForm} style={{ padding: '10px 14px', borderRadius: 8 }}>
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(12,18,30,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>Ringkasan</h2>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{products.length}</div>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Produk tersimpan hanya di memori saat halaman aktif.</p>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Daftar Produk</h2>

        {products.length === 0 ? (
          <div style={{ padding: 18, borderRadius: 12, border: '1px dashed #e6eef8', color: '#6b7280' }}>
            Belum ada produk. Tambahkan produk lewat form.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
            {products.map((p) => (
              <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'white', padding: 12, borderRadius: 10, border: '1px solid #eef4ff' }}>
                <div style={{ width: 84, height: 84, borderRadius: 8, overflow: 'hidden', background: '#f1f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{e.currentTarget.style.display='none'}} /> : <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#eef6ff"/><path d="M7 14l2.5-3L12 16l3.5-4L17 14" stroke="#8bb8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>#{p.id} • {new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0b4a7a' }}>Rp {formatPrice(p.price)}</div>
                  </div>
                  {p.desc && <div style={{ marginTop: 8, color: '#374151' }}>{p.desc}</div>}

                  <div style={{ marginTop: 10 }}>
                    <button onClick={() => handleStartEdit(p)} style={{ padding: '6px 10px', borderRadius: 8 }}>Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} style={{ padding: '6px 10px', borderRadius: 8, marginLeft: 8, background: '#ef4444', color: 'white', border: 'none' }}>Hapus</button>
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