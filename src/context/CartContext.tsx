'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // product._id + '-' + size + '-' + color
  productId: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('us_garment_cart');
      const storedSaved = localStorage.getItem('us_garment_saved');
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedSaved) setSavedForLater(JSON.parse(storedSaved));
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('us_garment_cart', JSON.stringify(cart));
      localStorage.setItem('us_garment_saved', JSON.stringify(savedForLater));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [cart, savedForLater]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.productId}-${item.size}-${item.color}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.maxStock || 99) }
            : i
        );
      }
      return [...prev, { ...item, id }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: Math.min(newQty, item.maxStock || 99) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const saveForLater = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      setCart((prev) => prev.filter((i) => i.id !== id));
      setSavedForLater((prev) => [...prev, item]);
    }
  };

  const moveToCart = (id: string) => {
    const item = savedForLater.find((i) => i.id === id);
    if (item) {
      setSavedForLater((prev) => prev.filter((i) => i.id !== id));
      setCart((prev) => [...prev, item]);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= 3000 || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FESTIVE10' || cleanCode === 'WELCOME10') {
      setCouponCode(cleanCode);
      setDiscountPercent(10);
      return { success: true, message: '10% discount applied successfully!' };
    }
    if (cleanCode === 'GARMENT20' || cleanCode === 'BULK20') {
      setCouponCode(cleanCode);
      setDiscountPercent(20);
      return { success: true, message: '20% special discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCart,
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
