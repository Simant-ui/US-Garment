'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Megaphone,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Power,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Phone,
  MessageSquare,
  X,
  Check,
  Globe,
  Monitor,
  Smartphone,
  AlertTriangle,
  Info,
  Tag as TagIcon,
} from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  updateAnnouncementStatus,
  AnnouncementData,
} from '@/services/api/announcementApi';

const DEFAULT_FORM_DATA: Partial<AnnouncementData> = {
  internalName: '',
  type: 'holiday',
  title: { en: '', ne: '' },
  subtitle: { en: '', ne: '' },
  content: { en: '', ne: '' },
  highlightText: { en: '', ne: '' },
  image: '',
  displayType: 'center_popup',
  popupStyle: 'important',
  primaryColor: '#DC2626',
  accentColor: '#10B981',
  ctaEnabled: true,
  ctaText: { en: 'Shop Now', ne: 'अहिले किनमेल गर्नुहोस्' },
  ctaUrl: '/products',
  allowDoNotShowAgain: true,
  displayFrequency: 'once_session',
  priority: 'high',
  isActive: true,
  startAt: new Date().toISOString().slice(0, 16),
  endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
};

export default function AdminAnnouncementsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AnnouncementData>>(DEFAULT_FORM_DATA);
  const [activeTab, setActiveTab] = useState<'en' | 'ne'>('en');

  // Preview Modal States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<AnnouncementData | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewLang, setPreviewLang] = useState<'en' | 'ne'>('ne');

  const fetchAnnouncementsList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAnnouncements({
        search,
        status: statusFilter === 'all' ? '' : statusFilter,
      });
      setAnnouncements(res.announcements);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchAnnouncementsList();
  }, [fetchAnnouncementsList]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_FORM_DATA,
      startAt: new Date().toISOString().slice(0, 16),
      endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AnnouncementData) => {
    setEditingId(item._id || null);
    setFormData({
      ...item,
      startAt: item.startAt ? new Date(item.startAt).toISOString().slice(0, 16) : '',
      endAt: item.endAt ? new Date(item.endAt).toISOString().slice(0, 16) : '',
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (item: AnnouncementData) => {
    if (!item._id) return;
    try {
      await updateAnnouncementStatus(item._id, !item.isActive);
      setSuccessMsg(`Announcement "${item.internalName}" status updated.`);
      fetchAnnouncementsList();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (item: AnnouncementData) => {
    if (!item._id) return;
    if (!confirm(`Are you sure you want to delete "${item.internalName}"?`)) return;
    try {
      await deleteAnnouncement(item._id);
      setSuccessMsg(`Announcement "${item.internalName}" deleted.`);
      fetchAnnouncementsList();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete announcement');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        setSuccessMsg('Announcement updated successfully!');
      } else {
        await createAnnouncement(formData);
        setSuccessMsg('Announcement created successfully!');
      }
      setIsModalOpen(false);
      fetchAnnouncementsList();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving announcement');
    }
  };

  const handleOpenPreview = (item: AnnouncementData) => {
    setPreviewData(item);
    setIsPreviewOpen(true);
  };

  const getStatusBadge = (item: AnnouncementData) => {
    const now = new Date();
    const start = new Date(item.startAt);
    const end = new Date(item.endAt);

    if (!item.isActive) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
          Inactive
        </span>
      );
    }
    if (start > now) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
          Scheduled
        </span>
      );
    }
    if (end < now) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
          Expired
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1.5 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Active
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const map: Record<string, string> = {
      urgent: 'bg-red-500 text-white',
      high: 'bg-amber-500 text-white',
      normal: 'bg-emerald-600 text-white',
      low: 'bg-slate-500 text-white',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${map[priority] || map.normal}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 flex items-center justify-between text-xs font-bold">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-between text-xs font-bold">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Announcement Management
              </h1>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Manage frontend customer notice popups, holiday banners, and promotional alerts.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Create Announcement
        </button>
      </div>

      {/* Filters Bar */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search notice name, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none transition ${
              isDark
                ? 'bg-[#101D32] border-[#1E304A] text-white focus:border-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
            }`}
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['all', 'active', 'inactive', 'scheduled', 'expired'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:bg-[#101D32] hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${isDark ? 'bg-[#101D32] border-[#1E304A] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <th className="py-3.5 px-4">Title / Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Languages</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Schedule Window</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Stats</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-medium ${isDark ? 'divide-[#1E304A] text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading announcements...
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No announcements found. Click &quot;+ Create Announcement&quot; to add one.
                  </td>
                </tr>
              ) : (
                announcements.map((item) => (
                  <tr key={item._id} className={isDark ? 'hover:bg-[#101D32]/50' : 'hover:bg-slate-50'}>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {item.internalName}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {item.title?.en || item.title?.ne}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.title?.en ? 'bg-blue-500/10 text-blue-500' : 'opacity-30'}`}>
                          EN
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.title?.ne ? 'bg-emerald-500/10 text-emerald-500' : 'opacity-30'}`}>
                          NE
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(item)}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] space-y-0.5">
                        <p className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3 h-3 text-emerald-500" />
                          <span>Start: {new Date(item.startAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </p>
                        <p className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-rose-500" />
                          <span>End: {new Date(item.endAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getPriorityBadge(item.priority)}</td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500">
                      <div>Views: {item.views || 0}</div>
                      <div>Clicks: {item.clicks || 0}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenPreview(item)}
                          title="Preview"
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit"
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title={item.isActive ? 'Disable' : 'Enable'}
                          className={`p-1.5 rounded-lg transition ${
                            item.isActive
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500'
                              : 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition"
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

      {/* CREATE / EDIT FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden my-auto ${isDark ? 'bg-[#0B1528] border-[#1E304A] text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            {/* Modal Top Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-[#1E304A] bg-[#101D32]' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* SECTION 1 — BASIC INFORMATION */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5" /> Section 1 — Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Internal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dashain Holiday Notice 2083"
                      value={formData.internalName || ''}
                      onChange={(e) => setFormData({ ...formData, internalName: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Announcement Type *</label>
                    <select
                      value={formData.type || 'holiday'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <option value="general">General Notice</option>
                      <option value="holiday">Holiday Notice</option>
                      <option value="important">Important Notice</option>
                      <option value="offer">Offer / Promotion</option>
                      <option value="delivery">Delivery Update</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BILINGUAL CONTENT TABS */}
              <div className="space-y-4 pt-2 border-t border-slate-200/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Bilingual Content
                  </h4>
                  <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveTab('en')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500'}`}
                    >
                      English 🇬🇧
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ne')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'ne' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500'}`}
                    >
                      नेपाली 🇳🇵
                    </button>
                  </div>
                </div>

                {activeTab === 'en' ? (
                  <div className="space-y-4 bg-slate-50/50 dark:bg-[#101D32]/50 p-4 rounded-xl border border-slate-200 dark:border-[#1E304A]">
                    <div>
                      <label className="block text-xs font-bold mb-1">Title (English) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Important Dashain Holiday Notice"
                        value={formData.title?.en || ''}
                        onChange={(e) => setFormData({ ...formData, title: { ...formData.title!, en: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Subtitle (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Orders & Delivery schedule update during festive season"
                        value={formData.subtitle?.en || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: { ...formData.subtitle!, en: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Content / Description (English) *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Detailed notice text (HTML bold/italic/paragraphs supported)..."
                        value={formData.content?.en || ''}
                        onChange={(e) => setFormData({ ...formData, content: { ...formData.content!, en: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Highlight Box Info (English)</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Holiday Period: Oct 15 - Oct 22"
                        value={formData.highlightText?.en || ''}
                        onChange={(e) => setFormData({ ...formData, highlightText: { ...formData.highlightText!, en: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">CTA Button Text (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Got It / Shop Now"
                        value={formData.ctaText?.en || ''}
                        onChange={(e) => setFormData({ ...formData, ctaText: { ...formData.ctaText!, en: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 bg-slate-50/50 dark:bg-[#101D32]/50 p-4 rounded-xl border border-slate-200 dark:border-[#1E304A]">
                    <div>
                      <label className="block text-xs font-bold mb-1 font-devanagari">शीर्षक (नेपाली) *</label>
                      <input
                        type="text"
                        required
                        placeholder="उदाहरण: दशैं विदाको समयमा अर्डर तथा डेलिभरी सम्बन्धी महत्वपूर्ण सूचना"
                        value={formData.title?.ne || ''}
                        onChange={(e) => setFormData({ ...formData, title: { ...formData.title!, ne: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-devanagari ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 font-devanagari">उपशीर्षक (नेपाली)</label>
                      <input
                        type="text"
                        placeholder="उदाहरण: चाडपर्वको विदा सम्बन्धी आधिकारिक जानकारी"
                        value={formData.subtitle?.ne || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: { ...formData.subtitle!, ne: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-devanagari ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 font-devanagari">विवरण (नेपाली) *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="सूचनाको विस्तृत विवरण..."
                        value={formData.content?.ne || ''}
                        onChange={(e) => setFormData({ ...formData, content: { ...formData.content!, ne: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-devanagari ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 font-devanagari">विशेष सूचना (नेपाली)</label>
                      <textarea
                        rows={2}
                        placeholder="उदाहरण: 📅 विदा अवधि: २०८३ असोज २९ देखि कार्तिक ५ सम्म"
                        value={formData.highlightText?.ne || ''}
                        onChange={(e) => setFormData({ ...formData, highlightText: { ...formData.highlightText!, ne: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-devanagari ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 font-devanagari">बटनको टेक्स्ट (नेपाली)</label>
                      <input
                        type="text"
                        placeholder="उदाहरण: बुझें / अहिले किनमेल गर्नुहोस्"
                        value={formData.ctaText?.ne || ''}
                        onChange={(e) => setFormData({ ...formData, ctaText: { ...formData.ctaText!, ne: e.target.value } })}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-devanagari ${isDark ? 'bg-[#0B1528] border-[#1E304A]' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2 — SCHEDULING & PRIORITY */}
              <div className="space-y-4 pt-2 border-t border-slate-200/40">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Scheduling & Priority
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startAt || ''}
                      onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">End Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endAt || ''}
                      onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Priority *</label>
                    <select
                      value={formData.priority || 'high'}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <option value="urgent">Urgent (First Priority)</option>
                      <option value="high">High</option>
                      <option value="normal">Normal</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3 — DISPLAY RULES & BEHAVIOR */}
              <div className="space-y-4 pt-2 border-t border-slate-200/40">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Display Rules & Behavior
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Display Frequency *</label>
                    <select
                      value={formData.displayFrequency || 'once_session'}
                      onChange={(e) => setFormData({ ...formData, displayFrequency: e.target.value as any })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <option value="every_visit">Every Visit</option>
                      <option value="once_session">Once Per Session</option>
                      <option value="once_day">Once Per Day</option>
                      <option value="once_only">Once Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Banner Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://... or /images/banner.jpg"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">CTA URL Route</label>
                    <input
                      type="text"
                      placeholder="/products or /shop"
                      value={formData.ctaUrl || ''}
                      onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={formData.allowDoNotShowAgain ?? true}
                        onChange={(e) => setFormData({ ...formData, allowDoNotShowAgain: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                      />
                      <span>Allow &quot;Do not show again&quot;</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={formData.isActive ?? true}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                      />
                      <span>Announcement Active (ON)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-200/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  {editingId ? 'Save Changes' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {isPreviewOpen && previewData && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Top Control Bar */}
          <div className="w-full max-w-4xl bg-slate-900 text-white p-3 rounded-t-2xl flex items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">Live Announcement Preview</span>
            </div>

            {/* Preview Controls */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewLang('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${previewLang === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setPreviewLang('ne')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${previewLang === 'ne' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                >
                  नेपाली
                </button>
              </div>

              {/* Device View Mode */}
              <div className="flex items-center bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg transition ${previewDevice === 'desktop' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg transition ${previewDevice === 'mobile' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full max-w-4xl bg-slate-950 p-6 rounded-b-2xl flex items-center justify-center min-h-[60vh] overflow-y-auto">
            {/* Simulated Modal Card */}
            <div
              className={`relative bg-white text-slate-900 rounded-[22px] shadow-2xl overflow-hidden border border-slate-200 transition-all duration-300 ${
                previewDevice === 'mobile' ? 'w-[360px]' : 'w-[680px]'
              }`}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#991B1B] text-white p-5 pr-12 flex items-center gap-3 border-b-4 border-[#10B981]">
                <div className="w-12 h-12 rounded-full bg-white text-[#DC2626] flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-emerald-400">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full mb-1">
                    {previewLang === 'ne' ? 'आधिकारिक सूचना' : 'OFFICIAL NOTICE'}
                  </span>
                  <h2 className="text-base md:text-lg font-bold leading-tight font-devanagari">
                    {previewLang === 'ne'
                      ? previewData.title?.ne || previewData.title?.en
                      : previewData.title?.en || previewData.title?.ne}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 text-xs md:text-sm">
                {previewData.image && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                    <Image
                      src={previewData.image}
                      alt="Banner"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div
                  className="leading-relaxed font-devanagari text-slate-800"
                  dangerouslySetInnerHTML={{
                    __html:
                      previewLang === 'ne'
                        ? previewData.content?.ne || previewData.content?.en || ''
                        : previewData.content?.en || previewData.content?.ne || '',
                  }}
                />

                {(previewData.highlightText?.en || previewData.highlightText?.ne) && (
                  <div className="p-3 rounded-xl bg-rose-50 border-l-4 border-rose-500 text-rose-900 font-devanagari text-xs flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      {previewLang === 'ne'
                        ? previewData.highlightText?.ne || previewData.highlightText?.en
                        : previewData.highlightText?.en || previewData.highlightText?.ne}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 relative bg-white p-0.5 rounded border">
                      <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">US DRESSES & GARMENT</p>
                      <p className="text-[10px] text-slate-500">Hetauda, Nepal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>+977 9855012345</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {previewData.allowDoNotShowAgain ? (
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                      <input type="checkbox" className="rounded text-emerald-600" />
                      <span>{previewLang === 'ne' ? 'यो सूचना पुनः नदेखाउनुहोस्' : 'Do not show again'}</span>
                    </label>
                  ) : <div />}
                  <button className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow">
                    {previewLang === 'ne'
                      ? previewData.ctaText?.ne || 'बुझें'
                      : previewData.ctaText?.en || 'Got It'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
