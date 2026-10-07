'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';
import ImageUploader from '@/components/common/ImageUploader';

export default function AdminProductsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    shortDescription: '',
    category: '',
    price: 1500,
    compareAtPrice: 1800,
    stock: 50,
    thumbnail: '',
    images: [] as string[],
    sizes: ['M', 'L', 'XL'],
    colors: ['Royal Green', 'Navy Blue'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isOnSale: true,
    tags: ['Garment'],
    status: 'PUBLISHED',
  });

  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resP, resC] = await Promise.all([
        fetch('/api/products?limit=50'),
        fetch('/api/categories'),
      ]);
      const dataP = await resP.json();
      const dataC = await resC.json();

      if (dataP.success) setProducts(dataP.products || []);
      if (dataC.success) {
        setCategories(dataC.categories || []);
        if (dataC.categories?.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: dataC.categories[0].id || dataC.categories[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const selectedCategory = formData.category || (categories[0]?.id || categories[0]?._id || '');
      const payload = {
        ...formData,
        category: selectedCategory,
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product');
      }

      setShowModal(false);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      description: '',
      shortDescription: '',
      category: categories[0]?.id || categories[0]?._id || '',
      price: 1500,
      compareAtPrice: 1800,
      stock: 50,
      thumbnail: '',
      images: [],
      sizes: ['M', 'L', 'XL'],
      colors: ['Royal Green', 'Navy Blue'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isOnSale: true,
      tags: ['Garment'],
      status: 'PUBLISHED',
    });
    setShowModal(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p.id || p._id);
    setFormData({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      shortDescription: p.shortDescription,
      category: typeof p.category === 'object' ? (p.category?.id || p.category?._id || '') : (p.categoryId || p.category || ''),
      price: p.price,
      compareAtPrice: p.compareAtPrice || p.price,
      stock: p.stock,
      thumbnail: p.thumbnail,
      images: p.images || [p.thumbnail],
      sizes: p.sizes || [],
      colors: p.colors || [],
      isFeatured: p.isFeatured || false,
      isNewArrival: p.isNewArrival || false,
      isBestSeller: p.isBestSeller || false,
      isOnSale: p.isOnSale || false,
      tags: p.tags || [],
      status: p.status || 'PUBLISHED',
    });
    setShowModal(true);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            Product Catalog Management
          </h1>
          <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Manage garment inventory, prices, images, and categories for US Dresses Udyog.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className={`px-5 py-2.5 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all ${
            isDark ? 'bg-[#10D990] text-[#050B18] hover:bg-[#0EB87B]' : 'bg-[#10B981] text-white hover:bg-[#059669]'
          }`}
        >
          <Plus className="w-4 h-4" /> Add New Garment
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-xl px-4 py-2.5 text-xs font-medium border outline-none transition-all ${
            isDark
              ? 'bg-[#0D192D] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
              : 'bg-white border-[#E2E8F0] text-[#0F172A] shadow-xs focus:ring-2 focus:ring-[#10B981]'
          }`}
        />
        <Search className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#94A3B8]' : 'text-[#94A3B8]'}`} />
      </div>

      {/* Products Table */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${
        isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`uppercase text-[10px] font-bold ${
              isDark ? 'bg-[#101D32] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]'
            }`}>
              <tr>
                <th className="p-3.5">Garment</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price (NPR)</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Badges</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1E304A]' : 'divide-[#E2E8F0]'}`}>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <Loader2 className={`w-6 h-6 animate-spin mx-auto ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`} />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`text-center py-8 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    No garments found. Click &quot;Add New Garment&quot; to populate products.
                  </td>
                </tr>
              ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id || p._id || p.slug} className={`transition-colors ${isDark ? 'hover:bg-[#101D32]' : 'hover:bg-[#F8FAFC]'}`}>
                    <td className="p-3 flex items-center gap-3">
                      <div className={`relative w-10 h-12 rounded-lg overflow-hidden border flex-shrink-0 ${
                        isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                      }`}>
                        <Image src={p.thumbnail} alt={p.name} fill className="object-cover" />
                      </div>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{p.name}</span>
                    </td>
                    <td className={`p-3 font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{p.sku}</td>
                    <td className={`p-3 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {typeof p.category === 'object' ? p.category?.name : 'Garment'}
                    </td>
                    <td className={`p-3 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      NPR {p.price?.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        p.stock > 10
                          ? isDark ? 'bg-[#064E3B] text-[#10D990]' : 'bg-[#ECFDF5] text-[#10B981]'
                          : isDark ? 'bg-rose-950 text-rose-300' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1.5">
                        {p.isFeatured && (
                          <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold ${
                            isDark ? 'bg-[#064E3B] text-[#10D990]' : 'bg-[#ECFDF5] text-[#10B981]'
                          }`}>Featured</span>
                        )}
                        {p.isNewArrival && (
                          <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold ${
                            isDark ? 'bg-purple-950 text-purple-300' : 'bg-purple-50 text-purple-700'
                          }`}>New</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark ? 'text-[#10D990] hover:bg-[#101D32]' : 'text-[#10B981] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.slug)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowModal(false)}></div>
          <div className={`relative w-full max-w-2xl p-6 rounded-3xl shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto border transition-colors ${
            isDark ? 'bg-[#0D192D] border-[#1E304A] text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
          }`}>
            <h2 className={`text-lg font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              {editingId ? 'Edit Garment Product' : 'Create New Garment Product'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    className={`w-full rounded-xl p-2.5 font-medium border outline-none transition-all ${
                      isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className={`w-full rounded-xl p-2.5 font-mono border outline-none transition-all ${
                      isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className={`w-full rounded-xl p-2.5 font-mono border outline-none transition-all ${
                      isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    Category *
                  </label>
                  <select
                    value={formData.category || (categories[0]?.id || categories[0]?._id || '')}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full rounded-xl p-2.5 font-medium border outline-none transition-all ${
                      isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    {categories.map((c) => {
                      const catId = c.id || c._id;
                      return <option key={catId} value={catId}>{c.name}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    Selling Price (NPR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`w-full rounded-xl p-2.5 font-medium border outline-none transition-all ${
                      isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className={`w-full rounded-xl p-2.5 font-medium border outline-none transition-all ${
                      isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className={`w-full rounded-xl p-2.5 font-medium border outline-none transition-all ${
                    isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Full Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full rounded-xl p-2.5 font-medium border outline-none transition-all ${
                    isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                  }`}
                ></textarea>
              </div>

              <ImageUploader
                label="Product Image (Max 5 MB)"
                required
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url, images: [url] })}
              />

              <div className="flex gap-4 pt-2">
                <label className={`flex items-center gap-2 font-medium cursor-pointer ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#10B981]"
                  /> Featured
                </label>
                <label className={`flex items-center gap-2 font-medium cursor-pointer ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-[#10B981]"
                  /> New Arrival
                </label>
              </div>

              <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-[#1E304A]' : 'border-[#E2E8F0]'}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                    isDark ? 'bg-[#101D32] text-[#94A3B8] hover:text-white' : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${
                    isDark ? 'bg-[#10D990] text-[#050B18] hover:bg-[#0EB87B]' : 'bg-[#10B981] text-white hover:bg-[#059669]'
                  }`}
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
