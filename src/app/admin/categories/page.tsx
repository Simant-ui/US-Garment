'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Loader2, FolderTree, Trash2 } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';
import ImageUploader from '@/components/common/ImageUploader';

export default function AdminCategoriesPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, image }),
      });
      if (res.ok) {
        setName('');
        setDescription('');
        setImage('');
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Delete error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div>
        <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Category Management
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Organize garment categories and parent hierarchies for US Dresses Udyog.
        </p>
      </div>

      {/* Create Category Form */}
      <form
        onSubmit={handleCreate}
        className={`p-6 rounded-2xl border transition-colors space-y-4 text-xs ${
          isDark
            ? 'bg-[#0D192D] border-[#1E304A]'
            : 'bg-white border-[#E2E8F0] shadow-xs'
        }`}
      >
        <h3 className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Add New Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ladies Kurtha"
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short category description"
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>
        </div>

        <div>
          <ImageUploader
            label="Category Header Image (Max 5 MB)"
            value={image}
            onChange={(url) => setImage(url)}
          />
        </div>

        <button
          type="submit"
          className={`px-5 py-2.5 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all ${
            isDark ? 'bg-[#10D990] text-[#050B18] hover:bg-[#0EB87B]' : 'bg-[#10B981] hover:bg-[#059669]'
          }`}
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </form>

      {/* Category List Card */}
      <div
        className={`rounded-2xl border p-6 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#0D192D] border-[#1E304A]'
            : 'bg-white border-[#E2E8F0] shadow-xs'
        }`}
      >
        <h3 className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Existing Categories ({categories.length})
        </h3>
        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className={`w-6 h-6 animate-spin mx-auto ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`} />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <FolderTree className={`w-8 h-8 mx-auto opacity-50 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
            <p className={`text-xs font-medium ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              No categories created yet. Use the form above to add categories.
            </p>
          </div>
        ) : (
          <div className={`divide-y text-xs ${isDark ? 'divide-[#1E304A]' : 'divide-[#E2E8F0]'}`}>
            {categories.map((c) => {
              const catId = c.id || c._id;
              const isDeleting = deletingId === catId;

              return (
                <div key={catId} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {c.image && (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                      />
                    )}
                    <div>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{c.name}</p>
                      <p className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Slug: /{c.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      isDark ? 'bg-[#064E3B] text-[#10D990]' : 'bg-[#ECFDF5] text-[#10B981]'
                    }`}>
                      Active
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(catId, c.name)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Category"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
