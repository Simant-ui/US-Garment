'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, Phone, MessageCircle, MapPin, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { SITE_CONFIG } from '@/lib/constants';
import BrandLogo from '@/components/common/BrandLogo';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import CategoriesMegaMenu from '@/components/layout/CategoriesMegaMenu';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const isNe = language === 'ne';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const desktopLinks = [
    { name: t('nav.home'), href: '/' },
    // CategoriesMegaMenu is rendered right here between Home and Custom Orders!
    { name: t('nav.customOrders'), href: '/custom-stitching' },
    { name: t('nav.wholesale'), href: '/wholesale' },
    { name: isNe ? 'हाम्रो बारेमा' : 'About Us', href: '/about' },
    { name: isNe ? 'सम्पर्क' : 'Contact', href: '/contact' },
  ];

  const mobileCategoriesList = [
    {
      name: isNe ? 'महिला पोशाक' : 'Women',
      slug: 'women',
      subcategories: [
        { name: isNe ? 'महिला कुर्ता' : 'Ladies Kurtha', slug: 'ladies-kurtha' },
        { name: isNe ? 'गाउन' : 'Gown', slug: 'gown' },
        { name: isNe ? 'साडी' : 'Saree', slug: 'saree' },
        { name: isNe ? 'सलवार सुट' : 'Salwar Suit', slug: 'salwar-suit' },
        { name: isNe ? 'फेन्सी ड्रेस' : 'Fancy Dress', slug: 'fancy-dress' },
        { name: isNe ? 'टप्स' : 'Tops', slug: 'tops' },
      ],
    },
    {
      name: isNe ? 'स्कुल हाउस ड्रेस' : 'School Uniform',
      slug: 'school-uniform',
      subcategories: [
        { name: isNe ? 'केटाकेटीको पोसाक' : 'Boys Uniform', slug: 'boys-uniform' },
        { name: isNe ? 'केटीको पोसाक' : 'Girls Uniform', slug: 'girls-uniform' },
        { name: isNe ? 'सर्ट' : 'Shirt', slug: 'shirt' },
        { name: isNe ? 'प्यान्ट' : 'Pant', slug: 'pant' },
        { name: isNe ? 'स्कर्ट' : 'Skirt', slug: 'skirt' },
      ],
    },
    {
      name: isNe ? 'घरायसी पोशाक' : 'House Dress',
      slug: 'house-dress',
      subcategories: [
        { name: isNe ? 'कटन हाउस ड्रेस' : 'Cotton House Dress', slug: 'cotton-house-dress' },
        { name: isNe ? 'नाइट ड्रेस' : 'Night Dress', slug: 'night-dress' },
        { name: isNe ? 'दैनिक पहिरन' : 'Daily Wear', slug: 'daily-wear' },
      ],
    },
    {
      name: isNe ? 'टी-सर्ट' : 'T-Shirts',
      slug: 't-shirts',
      subcategories: [
        { name: isNe ? 'राउन्ड नेक' : 'Round Neck', slug: 'round-neck' },
        { name: isNe ? 'पोलो' : 'Polo', slug: 'polo' },
        { name: isNe ? 'कस्टम प्रिन्टेड' : 'Custom Printed', slug: 'custom-printed' },
      ],
    },
    {
      name: isNe ? 'पोशाक' : 'Dresses',
      slug: 'dresses',
      subcategories: [
        { name: isNe ? 'क्याजुअल ड्रेस' : 'Casual Dress', slug: 'casual-dress' },
        { name: isNe ? 'पार्टी वेयर' : 'Party Wear', slug: 'party-wear' },
        { name: isNe ? 'परम्परागत' : 'Traditional', slug: 'traditional' },
      ],
    },
    {
      name: isNe ? 'ट्र्याकसुट' : 'Track Suits',
      slug: 'track-suits',
      subcategories: [
        { name: isNe ? 'विद्यालय ट्र्याकसुट' : 'School Track Suit', slug: 'school-track-suit' },
        { name: isNe ? 'स्पोर्ट्स ट्र्याकसुट' : 'Sports Track Suit', slug: 'sports-track-suit' },
        { name: isNe ? 'कस्टम ट्र्याकसुट' : 'Custom Track Suit', slug: 'custom-track-suit' },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-[#E6F4EE] text-[#10233F] text-xs py-2 px-4 border-b border-[#D0EAE0]">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
          <p className="font-semibold tracking-tight text-[#0F4C3A] text-xs sm:text-sm font-devanagari">
            {t('topBar.announcement')}
          </p>
          <div className="flex items-center space-x-3 sm:space-x-5 text-xs text-[#10233F]">
            <a href={`tel:${SITE_CONFIG.phone}`} className="hidden md:flex items-center gap-1.5 font-medium hover:text-[#0F4C3A] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#0F4C3A]" />
              <span>{SITE_CONFIG.phone}</span>
            </a>
            <span className="hidden md:inline text-[#D0EAE0]">|</span>
            <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-1.5 font-medium hover:text-[#0F4C3A] transition-colors font-devanagari">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('topBar.whatsappUs')}</span>
            </a>
            <span className="hidden md:inline text-[#D0EAE0]">|</span>
            <div className="hidden lg:flex items-center gap-1 font-medium text-[#10233F] font-devanagari">
              <MapPin className="w-3.5 h-3.5 text-[#0F4C3A]" />
              <span>{t('topBar.location')}</span>
            </div>
            <span className="hidden lg:inline text-[#D0EAE0]">|</span>
            <LanguageSwitcher variant="topbar" />
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div
        className={`bg-white transition-all duration-300 ${isScrolled ? 'shadow-md py-3' : 'py-3.5 border-b border-slate-100 shadow-sm'
          }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#10233F] hover:text-[#0F4C3A] transition-colors rounded-lg hover:bg-slate-100"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Official Logo Branding */}
          <BrandLogo variant="store" size="lg" />

          {/* Desktop Navigation with Prominent Categories Mega Menu */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-xs xl:text-sm font-semibold text-[#10233F]">
            {/* Home link */}
            <Link
              href="/"
              className={`transition-colors py-1.5 relative whitespace-nowrap font-devanagari ${pathname === '/' ? 'text-[#0F4C3A] font-bold' : 'hover:text-[#0F4C3A]'
                }`}
            >
              {t('nav.home')}
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0F4C3A] rounded-full"></span>
              )}
            </Link>

            {/* CATEGORIES MEGA MENU BUTTON & DROPDOWN */}
            <CategoriesMegaMenu />

            {/* Remaining Links */}
            {desktopLinks.slice(1).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1.5 relative whitespace-nowrap font-devanagari ${isActive ? 'text-[#0F4C3A] font-bold' : 'hover:text-[#0F4C3A]'
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0F4C3A] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-[#0F4C3A] rounded-full shadow-lg px-3 py-1.5 w-60 sm:w-72 z-20">
                  <input
                    type="text"
                    placeholder={t('shop.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs text-[#10233F] focus:outline-none bg-transparent font-medium font-devanagari"
                    autoFocus
                  />
                  <button type="submit" className="text-[#0F4C3A] hover:text-[#0B3B2D] p-1">
                    <Search className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600 ml-1 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#10233F] hover:text-[#0F4C3A] transition-colors rounded-full hover:bg-[#F1F8F5]"
                  aria-label={t('shop.searchProducts')}
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Account Link */}
            <Link
              href={user ? (user.role !== 'CUSTOMER' ? '/admin' : '/account') : '/login'}
              className="p-2 text-[#10233F] hover:text-[#0F4C3A] transition-colors rounded-full hover:bg-[#F1F8F5] hidden sm:flex items-center gap-1.5 text-xs font-bold font-devanagari"
              aria-label={t('nav.account')}
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline">{user ? user.name.split(' ')[0] : t('nav.account')}</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              className="p-2 text-[#10233F] hover:text-[#0F4C3A] transition-colors rounded-full hover:bg-[#F1F8F5] relative hidden sm:flex"
              aria-label={t('nav.wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="p-2.5 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white rounded-full transition-all flex items-center justify-center relative shadow-sm hover:shadow-md"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#10233F] font-extrabold text-xs rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F4C3A] text-white font-serif font-bold text-xl flex items-center justify-center">
                    US
                  </div>
                  <div>
                    <span className="font-serif font-bold text-[#10233F] block">US Dresses</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#0F4C3A] font-bold font-devanagari">{t('topBar.location')}</span>
                  </div>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Language Switcher */}
              <div className="my-4">
                <LanguageSwitcher variant="mobile" />
              </div>

              <nav className="flex flex-col space-y-1 mt-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors font-devanagari ${pathname === '/' ? 'bg-[#E6F4EE] text-[#0F4C3A]' : 'text-[#10233F] hover:bg-slate-50'
                    }`}
                >
                  {t('nav.home')}
                </Link>

                {/* Mobile Accordion for Categories */}
                <div className="border-y border-slate-100 py-1 my-1">
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between text-sm font-bold py-2.5 px-3 rounded-lg text-[#0F4C3A] bg-[#ECFDF5] font-devanagari"
                  >
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-[#0F4C3A]" />
                      <span>{isNe ? 'वर्गहरू' : 'Categories'}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="pl-4 pr-2 py-2 space-y-2 mt-1 bg-slate-50 rounded-xl text-xs">
                      {mobileCategoriesList.map((cat) => (
                        <div key={cat.slug} className="space-y-1">
                          <Link
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block font-bold text-[#0F4C3A] py-1 font-devanagari"
                          >
                            {cat.name}
                          </Link>
                          <div className="pl-3 space-y-1 border-l-2 border-emerald-200">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/shop?category=${sub.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-slate-600 hover:text-emerald-700 py-0.5 font-devanagari"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {desktopLinks.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors font-devanagari ${pathname === link.href
                        ? 'bg-[#E6F4EE] text-[#0F4C3A]'
                        : 'text-[#10233F] hover:bg-slate-50'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <Link
                href={user ? '/account' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-xs font-bold text-[#10233F] hover:bg-slate-100 font-devanagari"
              >
                <User className="w-5 h-5 text-[#0F4C3A]" />
                <span>{user ? user.name : t('nav.login')}</span>
              </Link>
              <Link
                href="/account/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-[#10233F] hover:bg-slate-100 font-devanagari"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-600" />
                  <span>{t('nav.wishlist')}</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-[10px]">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
