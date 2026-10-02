import type { Metadata } from 'next';
import './globals.css';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-devanagari',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'US Dresses and Garment Udyog | Hetauda, Nepal',
    template: '%s | US Dresses & Garment Udyog',
  },
  description:
    'US Dresses and Garment Udyog in Hetauda, Makwanpur, Nepal. Premium garment manufacturer, school uniform supplier, house dresses, ladies kurtha, gowns, t-shirts & custom stitching.',
  keywords: [
    'Garment Udyog Hetauda',
    'Garments in Hetauda',
    'Ladies Dresses Hetauda',
    'School Uniform Hetauda',
    'House Dress Nepal',
    'Garment Manufacturer Nepal',
    'Custom Garment Nepal',
    'Wholesale Garments Nepal',
    'US Dresses Makwanpur',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'US Dresses and Garment Udyog | Hetauda, Nepal',
    description: 'Premier garment manufacturer and retail store in Hetauda, Makwanpur, Nepal.',
    url: 'https://usdresses.com.np',
    siteName: 'US Dresses & Garment Udyog',
    locale: 'ne_NP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne" className={`${inter.variable} ${notoSansDevanagari.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col justify-between font-sans">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <FloatingWhatsApp />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
