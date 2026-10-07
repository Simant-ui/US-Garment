'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, ChevronDown, ChevronRight, ArrowRight, Shirt, Package, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryTree, CategoryData } from '@/services/api/categoryApi';

const formatNepaliNumber = (num: number): string => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (d) => nepaliDigits[parseInt(d, 10)]);
};

const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    _id: 'cat-women',
    name: { en: 'Women', ne: 'महिला पोशाक' },
    slug: 'women',
    icon: '👗',
    image: '',
    isActive: true,
    productCount: 173,
    subcategories: [
      { _id: 'sub-1', name: { en: 'Ladies Kurtha', ne: 'महिला कुर्ता' }, slug: 'ladies-kurtha', productCount: 45, isActive: true, image: '' },
      { _id: 'sub-2', name: { en: 'Gown', ne: 'गाउन' }, slug: 'gown', productCount: 28, isActive: true, image: '' },
      { _id: 'sub-3', name: { en: 'Saree', ne: 'साडी' }, slug: 'saree', productCount: 32, isActive: true, image: '' },
      { _id: 'sub-4', name: { en: 'Salwar Suit', ne: 'सलवार सुट' }, slug: 'salwar-suit', productCount: 26, isActive: true, image: '' },
      { _id: 'sub-5', name: { en: 'Fancy Dress', ne: 'फेन्सी ड्रेस' }, slug: 'fancy-dress', productCount: 18, isActive: true, image: '' },
      { _id: 'sub-6', name: { en: 'Tops', ne: 'टप्स' }, slug: 'tops', productCount: 22, isActive: true, image: '' },
    ],
  },
  {
    _id: 'cat-school',
    name: { en: 'School Uniform', ne: 'विद्यालय पोशाक' },
    slug: 'school-uniform',
    icon: '🎓',
    image: '',
    isActive: true,
    productCount: 142,
    subcategories: [
      { _id: 'sub-7', name: { en: 'Boys Uniform', ne: 'केटाकेटीको पोसाक' }, slug: 'boys-uniform', productCount: 38, isActive: true, image: '' },
      { _id: 'sub-8', name: { en: 'Girls Uniform', ne: 'केटीको पोसाक' }, slug: 'girls-uniform', productCount: 42, isActive: true, image: '' },
      { _id: 'sub-9', name: { en: 'Shirt', ne: 'सर्ट' }, slug: 'shirt', productCount: 24, isActive: true, image: '' },
      { _id: 'sub-10', name: { en: 'Pant', ne: 'प्यान्ट' }, slug: 'pant', productCount: 20, isActive: true, image: '' },
      { _id: 'sub-11', name: { en: 'Skirt', ne: 'स्कर्ट' }, slug: 'skirt', productCount: 18, isActive: true, image: '' },
    ],
  },
  {
    _id: 'cat-house',
    name: { en: 'House Dress', ne: 'घरायसी पोशाक' },
    slug: 'house-dress',
    icon: '👚',
    image: '',
    isActive: true,
    productCount: 68,
    subcategories: [
      { _id: 'sub-12', name: { en: 'Cotton House Dress', ne: 'कटन हाउस ड्रेस' }, slug: 'cotton-house-dress', productCount: 30, isActive: true, image: '' },
      { _id: 'sub-13', name: { en: 'Night Dress', ne: 'नाइट ड्रेस' }, slug: 'night-dress', productCount: 22, isActive: true, image: '' },
      { _id: 'sub-14', name: { en: 'Daily Wear', ne: 'दैनिक पहिरन' }, slug: 'daily-wear', productCount: 16, isActive: true, image: '' },
    ],
  },
  {
    _id: 'cat-tshirts',
    name: { en: 'T-Shirts', ne: 'टी-सर्ट' },
    slug: 't-shirts',
    icon: '👕',
    image: '',
    isActive: true,
    productCount: 84,
    subcategories: [
      { _id: 'sub-15', name: { en: 'Round Neck', ne: 'राउन्ड नेक' }, slug: 'round-neck', productCount: 34, isActive: true, image: '' },
      { _id: 'sub-16', name: { en: 'Polo', ne: 'पोलो' }, slug: 'polo', productCount: 26, isActive: true, image: '' },
      { _id: 'sub-17', name: { en: 'Custom Printed', ne: 'कस्टम प्रिन्टेड' }, slug: 'custom-printed', productCount: 24, isActive: true, image: '' },
    ],
  },
  {
    _id: 'cat-dresses',
    name: { en: 'Dresses', ne: 'पोशाक' },
    slug: 'dresses',
    icon: '👗',
    image: '',
    isActive: true,
    productCount: 95,
    subcategories: [
      { _id: 'sub-18', name: { en: 'Casual Dress', ne: 'क्याजुअल ड्रेस' }, slug: 'casual-dress', productCount: 35, isActive: true, image: '' },
      { _id: 'sub-19', name: { en: 'Party Wear', ne: 'पार्टी वेयर' }, slug: 'party-wear', productCount: 32, isActive: true, image: '' },
      { _id: 'sub-20', name: { en: 'Traditional', ne: 'परम्परागत' }, slug: 'traditional', productCount: 28, isActive: true, image: '' },
    ],
  },
  {
    _id: 'cat-tracksuits',
    name: { en: 'Track Suits', ne: 'ट्र्याकसुट' },
    slug: 'track-suits',
    icon: '🏃',
    image: '',
    isActive: true,
    productCount: 72,
    subcategories: [
      { _id: 'sub-21', name: { en: 'School Track Suit', ne: 'विद्यालय ट्र्याकसुट' }, slug: 'school-track-suit', productCount: 28, isActive: true, image: '' },
      { _id: 'sub-22', name: { en: 'Sports Track Suit', ne: 'स्पोर्ट्स ट्र्याकसुट' }, slug: 'sports-track-suit', productCount: 24, isActive: true, image: '' },
      { _id: 'sub-23', name: { en: 'Custom Track Suit', ne: 'कस्टम ट्र्याकसुट' }, slug: 'custom-track-suit', productCount: 20, isActive: true, image: '' },
    ],
  },
];

export default function CategoriesMegaMenu() {
  const { language } = useLanguage();
  const isNe = language === 'ne';

  const [categories, setCategories] = useState<CategoryData[]>(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<CategoryData>(DEFAULT_CATEGORIES[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTree = async () => {
      try {
        const res = await getCategoryTree();
        if (isMounted && res.tree && res.tree.length > 0) {
          setCategories(res.tree);
          setActiveCategory(res.tree[0]);
        }
      } catch (err) {
        console.warn('Using default category fallback');
      }
    };
    fetchTree();
    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryName = (cat: CategoryData) => {
    if (!cat.name) return '';
    if (typeof cat.name === 'string') return cat.name;
    return isNe ? cat.name.ne || cat.name.en : cat.name.en || cat.name.ne;
  };

  const activeName = getCategoryName(activeCategory);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Prominent Categories Navbar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 px-4 rounded-[10px] font-bold text-xs xl:text-sm flex items-center gap-2.5 transition-all shadow-sm ${
          isOpen
            ? 'bg-[#047857] text-white shadow-md'
            : 'bg-[#065F46] hover:bg-[#047857] text-white'
        }`}
        aria-expanded={isOpen}
      >
        <LayoutGrid className="w-4 h-4 text-white" />
        <span className="font-devanagari tracking-tight">
          {isNe ? 'वर्गहरू' : 'Categories'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-emerald-200 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* MEGA MENU DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-[780px] xl:w-[860px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_16px_40px_rgba(15,23,42,0.12)] overflow-hidden flex">
            {/* LEFT COLUMN: Main Categories List (approx 35% width) */}
            <div className="w-[35%] bg-slate-50/80 border-r border-slate-200 p-4 space-y-1">
              <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-devanagari flex items-center justify-between">
                <span>{isNe ? 'वर्गहरू' : 'Categories'}</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              </div>

              <div className="space-y-1">
                {categories.map((cat) => {
                  const catId = cat.id || cat._id;
                  const activeCatId = activeCategory.id || activeCategory._id;
                  const isSelected = activeCatId === catId;
                  const name = getCategoryName(cat);

                  return (
                    <button
                      key={catId}
                      onMouseEnter={() => setActiveCategory(cat)}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs xl:text-sm font-semibold transition-all font-devanagari ${
                        isSelected
                          ? 'bg-[#ECFDF5] text-[#0F172A] font-bold border-l-4 border-[#047857] shadow-sm'
                          : 'text-[#334155] hover:bg-white hover:text-[#0F172A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base leading-none">
                          {cat.icon || '👗'}
                        </span>
                        <span className="truncate">{name}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-[#047857] translate-x-0.5' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Subcategories Grid (approx 65% width) */}
            <div className="w-[65%] p-6 flex flex-col justify-between bg-white">
              <div className="space-y-4">
                {/* Heading & View All link */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base xl:text-lg font-bold text-[#0F172A] font-devanagari flex items-center gap-2">
                      <span>{activeName}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-devanagari">
                      {isNe
                        ? `${formatNepaliNumber(activeCategory.productCount || 0)} उपलब्ध मोडल तथा डिजाइनहरू`
                        : `${activeCategory.productCount || 0} products available`}
                    </p>
                  </div>

                  <Link
                    href={`/shop?category=${activeCategory.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1 text-xs font-bold text-[#047857] hover:text-[#065F46] transition font-devanagari group"
                  >
                    <span>{isNe ? 'सबै हेर्नुहोस्' : 'View All'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Subcategories 2-Column Grid */}
                {activeCategory.subcategories && activeCategory.subcategories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                    {activeCategory.subcategories.map((sub) => {
                      const subName = getCategoryName(sub);
                      const count = sub.productCount || 0;
                      const countText = isNe
                        ? `${formatNepaliNumber(count)} उत्पादन`
                        : `${count} Products`;
                      const subImgSrc = sub.image || '';

                      return (
                        <Link
                          key={sub.id || sub._id}
                          href={`/shop?category=${sub.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-[#ECFDF5]/50 transition-all group"
                        >
                          {/* Image or Garment Placeholder */}
                          <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                            {subImgSrc ? (
                              <img
                                src={subImgSrc}
                                alt={subName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform rounded-lg"
                              />
                            ) : (
                              <Shirt className="w-6 h-6 text-emerald-700 opacity-80" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs xl:text-sm font-bold text-[#0F172A] group-hover:text-[#047857] transition-colors font-devanagari truncate">
                              {subName}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-devanagari mt-0.5">
                              {countText}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs font-devanagari">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>{isNe ? 'सबै उत्पादनहरू हेर्न View All थिच्नुहोस्' : 'Click View All to browse products'}</p>
                  </div>
                )}
              </div>

              {/* Bottom Quick Feature Banner */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-devanagari font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  ✨ {isNe ? '१००% गुणस्तरीय सिलाई तथा कपडा' : '100% Quality Fabric & Stitching'}
                </span>
                <span className="font-devanagari text-slate-400">
                  Hetauda, Nepal
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
