'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/lib/types';
import {
  ShoppingBag,
  Phone,
  MessageCircle,
  Plus,
  Minus,
  ChevronDown,
  Play,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Upload,
  Edit,
  Star,
} from 'lucide-react';

interface Template3Props {
  product: Product;
}

// English digits -> Bengali numerals (app-wide convention)
const toBn = (num: number | string) => {
  const map: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return String(num).split('').map((d) => map[d] ?? d).join('');
};

// Scroll-reveal wrapper — restrained fade-up, fires once
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <Reveal className={center ? 'text-center mb-10' : 'mb-10'}>
      <h2 className={`font-serif text-2xl sm:text-3xl font-bold text-[#1a365d] ${center ? 'mx-auto' : ''}`}>{children}</h2>
      <span className={`block h-1 w-16 bg-blue-600 rounded-full mt-3 ${center ? 'mx-auto' : ''}`} />
    </Reveal>
  );
}

export default function Template3({ product }: Template3Props) {
  const sanitizeName = (name: string) =>
    name ? name.replace(/\s*\(কোড:\s*.*?\)/g, '').replace(/N660/gi, '').trim() : '';

  const sizesList = product.sizes && product.sizes.length > 0 ? product.sizes : ['M', 'L', 'XL', 'XXL'];
  const outOfStockList = product.outOfStockSizes
    ? product.outOfStockSizes.split(',').map((s) => s.trim().toUpperCase())
    : [];
  const colorsList = product.colors && product.colors.length > 0
    ? product.colors
    : ['সাদা', 'বাদামি', 'গাঢ় নীল', 'ধূসর'];

  const [selectedSize, setSelectedSize] = useState(sizesList[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(colorsList[0] || 'সাদা');
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [playVideo, setPlayVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  // Review submission (mirrors Template 1/2)
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => { setSelectedSize(sizesList[0]); }, [product.sizes]);
  useEffect(() => { setSelectedColor(colorsList[0]); }, [product.colors]);
  useEffect(() => {
    const idx = colorsList.indexOf(selectedColor);
    if (idx !== -1 && idx < 5) setCurrentImage(idx);
  }, [selectedColor]);
  useEffect(() => {
    if (reviewSubmitted) {
      const t = setTimeout(() => setReviewSubmitted(false), 6000);
      return () => clearTimeout(t);
    }
  }, [reviewSubmitted]);

  // Countdown ticker — counts down to product.offerEndsAt, else a rolling 2-day window
  useEffect(() => {
    const target = product.offerEndsAt
      ? new Date(product.offerEndsAt).getTime()
      : new Date().getTime() + 2 * 24 * 60 * 60 * 1000;
    const tick = () => {
      const diff = target - new Date().getTime();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [product.offerEndsAt]);

  const deliveryFeeDhaka = Number(product.deliveryDhaka) || 60;
  const deliveryFeeOutside = Number(product.deliveryOutside) || 120;
  const deliveryFee = deliveryArea === 'dhaka' ? deliveryFeeDhaka : deliveryFeeOutside;

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

  const galleryImages = [
    product.images[0] || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=900&h=1100&fit=crop',
    product.images[1] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=1100&fit=crop',
    product.images[2] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&h=1100&fit=crop',
    product.images[3] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=900&h=1100&fit=crop',
    product.images[4] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=1100&fit=crop',
  ];

  const getColorHex = (name: string) => {
    const clean = (name || '').trim().toLowerCase().normalize('NFC');
    const map: Record<string, string> = {
      'সাদা': '#f4f1ea', 'বাদামি': '#b98a5e', 'গাঢ় নীল': '#1e2a44', 'ধূসর': '#9aa2ac',
      'কালো': '#20242b', 'লাল': '#c0392b', 'নীল': '#2f6fb0', 'সবুজ': '#3f8f5a',
      'অফ হোয়াইট': '#efe9dc', 'ক্রিম': '#efe4c8', 'মেরুন': '#6d2530', 'সোনালি': '#c6a15b',
    };
    const nm: Record<string, string> = {};
    for (const k of Object.keys(map)) nm[k.normalize('NFC')] = map[k];
    return nm[clean] || '#9aa2ac';
  };

  const featuresList = product.features && product.features.length > 0
    ? product.features
    : ['উন্নত মানের উপাদান', 'দ্রুত ও শক্তিশালী পারফরম্যান্স', 'দীর্ঘস্থায়ী ব্যাটারি লাইফ', 'ওয়াটারপ্রুফ ডিজাইন', 'প্রিমিয়াম ফিনিশিং', '১ বছরের ওয়ারেন্টি'];

  const faqList = product.faqs && product.faqs.length > 0
    ? product.faqs
    : [
      { q: 'ব্যাটারি কতদিন চলে?', a: 'ফুল চার্জে ৭ দিন পর্যন্ত ব্যাকআপ পাওয়া যায় সাধারণ ব্যবহারে।' },
      { q: 'গরম পানি রাখা যাবে কি?', a: 'জি, স্টেইনলেস স্টিল বডি গরম ও ঠান্ডা উভয় পানি দীর্ঘক্ষণ ধরে রাখতে পারে।' },
      { q: 'বোতল কীভাবে পরিষ্কার করবো?', a: 'হালকা গরম পানি ও মাইল্ড সাবান দিয়ে ধুয়ে ভালোভাবে শুকিয়ে নিন।' },
      { q: 'রিটার্ন পলিসি কী?', a: 'ডেলিভারির সময় প্রোডাক্ট চেক করে সমস্যা থাকলে সাথে সাথে এক্সচেঞ্জ বা রিটার্ন করতে পারবেন।' },
    ];

  const [storeReviews, setStoreReviews] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('reviews');
      if (stored) {
        try {
          setStoreReviews(JSON.parse(stored));
        } catch (err) { }
      }
    }
  }, [reviewSubmitted]);

  // Combine productReviews from dashboard with approved ones from localStorage
  const approvedStoreReviews = storeReviews.filter(r => r.approved).map(r => ({
    name: r.name,
    city: r.city || 'ভেরিফায়েড বায়ার',
    text: r.comment,
    rating: r.rating || 5,
    image: r.image || ''
  }));

  const reviews = [
    ...(product.productReviews && product.productReviews.length > 0 ? product.productReviews : []),
    ...approvedStoreReviews
  ].length > 0 ? [
    ...(product.productReviews && product.productReviews.length > 0 ? product.productReviews : []),
    ...approvedStoreReviews
  ] : [
    { name: 'রাকিব হাসান', city: 'ভেরিফায়েড বায়ার', text: 'পানি অনেকক্ষণ ঠান্ডা থাকে। ডিজাইনও অনেক প্রিমিয়াম।', rating: 5, image: '' },
    { name: 'সুমাইয়া জান্নাত', city: 'ভেরিফায়েড বায়ার', text: 'ব্যাটারি ব্যাকআপ আমি খুব সন্তুষ্ট এই প্রোডাক্টে।', rating: 5, image: '' },
    { name: 'ভানভীর আহমেদ', city: 'ভেরিফায়েড বায়ার', text: 'LED ইন্ডিকেটর খুবই উপকারী। নিশ্চিন্তে ব্যবহার করতে পারি।', rating: 5, image: '' },
  ];

  const specs = product.specs && product.specs.length > 0
    ? product.specs
    : [
      { label: 'ডাইমেনশন (আকার)', value: '২৫.৫ x ৭.৫ সেমি' },
      { label: 'উপাদান', value: 'স্টেইনলেস স্টিল (BPA Free)' },
      { label: 'ওজন', value: '৩২০ গ্রাম' },
      { label: 'ব্যাটারি', value: '৭০০mAh (৭ দিন পর্যন্ত)' },
      { label: 'কানেক্টিভিটি', value: 'স্মার্ট LED ইন্ডিকেটর' },
      { label: 'প্যাকেজে যা থাকছে', value: 'বোতল, USB কেবল, ম্যানুয়াল' },
    ];

  const stats = product.stats && product.stats.length > 0
    ? product.stats
    : [
      { value: '৬০K+', label: 'সন্তুষ্ট গ্রাহক' },
      { value: '৪.৯/৫', label: 'গড় রেটিং' },
      { value: '৯৮%', label: 'সন্তুষ্টি হার' },
      { value: '১২০+', label: 'দেশে ব্যবহার হচ্ছে' },
    ];

  const ratingAverage = product.ratingAverage || '৪.৯';
  const ratingCount = product.ratingCount || '১,২৪৮';
  const ratingBars = product.ratingBars && product.ratingBars.length === 5 ? product.ratingBars : [92, 6, 2, 0, 0];

  const paymentMethods = product.paymentMethods && product.paymentMethods.length > 0
    ? product.paymentMethods
    : ['visa', 'mastercard', 'bkash', 'nagad', 'rocket'];

  const navLinks = product.navLinks && product.navLinks.length > 0
    ? product.navLinks
    : [
      { label: 'বৈশিষ্ট্য', anchor: 'features' },
      { label: 'রিভিউ', anchor: 'reviews' },
      { label: 'স্পেসিফিকেশন', anchor: 'specs' },
      { label: 'প্রশ্নোত্তর', anchor: 'faq' },
    ];

  const rawWa = (product.whatsappNumber || product.storePhone || '').replace(/[^\d]/g, '');
  const waLink = `https://wa.me/${rawWa.startsWith('880') ? rawWa : rawWa.startsWith('0') ? '880' + rawWa.slice(1) : '880' + rawWa}`;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setIsSubmitting(true);
    const orderIdNum = `ORD-${Date.now().toString().slice(-6)}`;
    const totalAmount = Math.round(discountedPrice * quantity) + deliveryFee;

    const newOrder = {
      id: orderIdNum,
      shopId: product.shopId || '1',
      customerId: Date.now().toString(),
      customerName: formData.name,
      customerEmail: `${formData.phone}@store.local`,
      products: [
        {
          id: product.id,
          name: `${product.name} (${selectedSize ? `সাইজ: ${selectedSize}` : ''}${selectedColor ? `, কালার: ${selectedColor}` : ''})`,
          quantity,
          price: Math.round(discountedPrice),
          subtotal: Math.round(discountedPrice * quantity),
        }
      ],
      subtotal: Math.round(discountedPrice * quantity),
      shipping: deliveryFee,
      tax: 0,
      total: totalAmount,
      status: 'pending',
      paymentMethod: 'ক্যাশ অন ডেলিভারি (COD)',
      paymentStatus: 'বাকি (Unpaid)',
      shippingAddress: `${formData.address} (ফোন: ${formData.phone}, এলাকা: ${deliveryArea === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})`,
      createdAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('orders');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('orders', JSON.stringify([newOrder, ...existing]));
      window.dispatchEvent(new Event('orders-updated'));
    } catch (err) {
      console.error('Order save error:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setPlacedOrderId(orderIdNum);
      setOrderSuccess(true);
      setFormData({ name: '', phone: '', address: '' });
      setTimeout(() => setOrderSuccess(false), 12000);
    }, 900);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stored = localStorage.getItem('reviews');
      let currentReviews: any[] = [];
      if (stored) {
        try { currentReviews = JSON.parse(stored); } catch (err) { /* ignore */ }
      }
      const newReview = {
        id: Date.now().toString(),
        name: reviewName,
        comment: reviewText,
        city: reviewCity || 'ঢাকা',
        date: 'আজই',
        rating: 5,
        approved: false,
      };
      localStorage.setItem('reviews', JSON.stringify([newReview, ...currentReviews]));
    } catch (err) { /* localStorage unavailable */ }
    setReviewName('');
    setReviewCity('');
    setReviewText('');
    setReviewSubmitted(true);
  };

  const storeName = product.storeName || 'PureSip';
  const total = Math.round(discountedPrice * quantity) + deliveryFee;

  const payLabel: Record<string, string> = {
    visa: 'VISA', mastercard: 'Mastercard', bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', cod: 'ক্যাশ অন ডেলিভারি',
  };
  const payColor: Record<string, string> = {
    visa: 'text-[#1a1f71]', mastercard: 'text-[#eb001b]', bkash: 'text-[#e2136e]', nagad: 'text-[#ec1c24]', rocket: 'text-[#8c3494]', cod: 'text-slate-700',
  };

  return (
    <motion.div
      key="template3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-slate-700 font-sans selection:bg-blue-600 selection:text-white"
    >
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg select-none">
              {storeName[0]}
            </span>
            <p className="font-bold text-lg text-[#1a365d]">{storeName}</p>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <button
                key={l.anchor}
                onClick={() => scrollTo(l.anchor)}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {product.showCart !== false && (
              <button onClick={() => scrollTo('order')} className="relative w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#1a365d] hover:border-blue-600 hover:text-blue-600 transition-colors cursor-pointer bg-white">
                <ShoppingBag size={17} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">{toBn(quantity)}</span>
              </button>
            )}
            <button
              onClick={() => scrollTo('order')}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full transition-colors cursor-pointer border-none"
            >
              অর্ডার করুন
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 to-white">
        <div className="max-w-[1400px] mx-auto px-6 pt-14 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full mb-6">
                🔥 {product.heroEyebrow || '২০২৬ সালের বেস্ট সেলার'}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] font-bold text-[#1a365d] mb-6">
                {product.heroTitle ? sanitizeName(product.heroTitle) : sanitizeName(product.name)}
                {product.heroSubtitle && <span className="block text-blue-600">{product.heroSubtitle}</span>}
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md mb-8">
                {product.description || 'আপনার পানি রাখে তাজা, পরিশুদ্ধ ও স্বাস্থ্যকর — সবসময়, যেখানেই যান।'}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-blue-600">৳ {toBn(Math.round(discountedPrice))}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-slate-400 line-through mb-1">৳ {toBn(Math.round(product.price))}</span>
                    <span className="mb-1.5 text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                      {toBn(product.discount)}% ছাড়
                    </span>
                  </>
                )}
              </div>
            </Reveal>

            {/* Sizes */}
            {product.showSizes !== false && (
              <Reveal delay={0.3} className="mb-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-2.5 font-bold">সাইজ</p>
                <div className="flex gap-2.5">
                  {sizesList.map((size) => {
                    const oos = outOfStockList.includes(size.trim().toUpperCase());
                    return (
                      <button
                        key={size}
                        disabled={oos}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                          oos
                            ? 'border-slate-200 text-slate-300 line-through cursor-not-allowed'
                            : selectedSize === size
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300 text-[#1a365d] hover:border-blue-600'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            )}

            {/* Colors */}
            {product.showColors !== false && (
              <Reveal delay={0.36} className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-2.5 font-bold">রং — {selectedColor}</p>
                <div className="flex gap-3">
                  {colorsList.map((c, idx) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedColor(c); if (idx < 5) setCurrentImage(idx); }}
                      title={c}
                      style={{ backgroundColor: getColorHex(c) }}
                      className={`w-9 h-9 rounded-full transition-all cursor-pointer ring-offset-2 ring-offset-white ${
                        selectedColor === c ? 'ring-2 ring-blue-600 scale-110' : 'ring-1 ring-slate-200 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.42}>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => scrollTo('order')}
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer border-none shadow-lg shadow-blue-600/25"
                >
                  <ShoppingBag size={17} /> এখনই অর্ডার করুন
                </button>
                {product.showVideo !== false && product.videoUrl && (
                  <button
                    onClick={() => { setPlayVideo(true); setTimeout(() => scrollTo('film'), 100); }}
                    className="inline-flex items-center gap-2.5 border border-slate-300 text-[#1a365d] hover:border-blue-600 font-bold text-sm px-7 py-4 rounded-full transition-all cursor-pointer bg-white"
                  >
                    <Play size={16} /> ভিডিও দেখুন
                  </button>
                )}
              </div>
            </Reveal>

            {/* mini trust row */}
            <Reveal delay={0.5}>
              <div className="flex flex-wrap gap-6 mt-9">
                {[
                  { icon: <Truck size={18} />, t: 'ফ্রি ডেলিভারি', s: 'সারা বাংলাদেশ' },
                  { icon: <Shield size={18} />, t: 'ক্যাশ অন ডেলিভারি', s: 'সুবিধা রয়েছে' },
                  { icon: <RotateCcw size={18} />, t: '৭ দিনের মধ্যে রিটার্ন', s: 'নিশ্চিত গ্যারান্টি' },
                ].map((it, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">{it.icon}</span>
                    <span className="leading-tight"><span className="block text-xs font-bold text-[#1a365d]">{it.t}</span><span className="block text-[10px] text-slate-400">{it.s}</span></span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Hero image */}
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute inset-8 bg-blue-100/60 rounded-full blur-2xl" />
              <div className="relative aspect-[4/5] max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <Image src={galleryImages[currentImage]} alt={sanitizeName(product.name)} fill className="object-contain drop-shadow-2xl" priority />
                  </motion.div>
                </AnimatePresence>
                {product.showBadges !== false && (
                  <div className="absolute top-4 right-2 bg-blue-600 text-white rounded-full w-20 h-20 flex flex-col items-center justify-center text-center shadow-lg">
                    <span className="text-[11px] font-bold leading-none">BPA</span>
                    <span className="text-[11px] font-bold leading-none">FREE</span>
                    <span className="text-[8px] mt-1 leading-none">নিরাপদ ও<br />স্বাস্থ্যকর</span>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Feature icon grid ── */}
      {product.showFeatures !== false && (
        <section id="features" className="max-w-[1400px] mx-auto px-6 -mt-10 relative z-10 pb-16">
          <Reveal>
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuresList.slice(0, 6).map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3 px-2 py-3">
                  <span className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Check size={22} />
                  </span>
                  <span className="text-xs font-bold text-[#1a365d] leading-tight">{f}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Gallery ── */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <SectionTitle>প্রোডাক্ট গ্যালারি</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryImages.map((img, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <button
                onClick={() => setCurrentImage(i)}
                className={`group relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border-2 ${
                  currentImage === i ? 'border-blue-600' : 'border-transparent'
                } ${i === 0 ? 'col-span-2 row-span-2 md:aspect-auto md:h-full' : ''}`}
              >
                <Image src={img} alt={`gallery ${i}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                {i === 0 && (
                  <span className="absolute bottom-4 left-4 bg-white/85 backdrop-blur-sm text-[#1a365d] text-[11px] font-bold px-3 py-1.5 rounded-full">৩৬০° ভিউ</span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Film ── */}
      {product.showVideo !== false && product.videoUrl && (
        <section id="film" className="max-w-[1400px] mx-auto px-6 py-10 scroll-mt-20">
          <Reveal>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              {playVideo ? (
                <iframe src={product.videoUrl} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture" />
              ) : (
                <button onClick={() => setPlayVideo(true)} className="group absolute inset-0 cursor-pointer border-none">
                  <Image src={galleryImages[2]} alt="film" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute inset-0 bg-[#1a365d]/25 group-hover:bg-[#1a365d]/15 transition-colors" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-20 h-20 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <Play size={28} className="text-blue-600 fill-blue-600 ml-1" />
                    </span>
                  </span>
                </button>
              )}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Why choose (trust badges) ── */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <Reveal>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <h3 className="text-center font-serif text-xl sm:text-2xl font-bold text-[#1a365d] mb-8">কেন {storeName} বেছে নেবেন?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Shield className="w-6 h-6" />, t: 'নিরাপদ পেমেন্ট', s: '১০০% নিরাপদ ও সুরক্ষিত পেমেন্ট নিশ্চিত করা হয়।' },
                { icon: <Truck className="w-6 h-6" />, t: 'দ্রুত ডেলিভারি', s: 'সারা বাংলাদেশে দ্রুত ও নিরাপদ ডেলিভারি।' },
                { icon: <MessageCircle className="w-6 h-6" />, t: '২৪/৭ সাপোর্ট', s: 'আমাদের কাস্টমার সাপোর্ট সবসময় আপনার জন্য প্রস্তুত।' },
                { icon: <RotateCcw className="w-6 h-6" />, t: 'মানি ব্যাক গ্যারান্টি', s: '৭ দিনের মধ্যে পণ্য ফেরত দিলে সম্পূর্ণ টাকা ফেরত।' },
              ].map((it, i) => (
                <Reveal key={i} delay={i * 0.08} className="text-center">
                  <span className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-3">{it.icon}</span>
                  <p className="font-bold text-sm text-[#1a365d] mb-1">{it.t}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{it.s}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Specs + Rating breakdown ── */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 grid lg:grid-cols-2 gap-8">
        {/* Spec table */}
        {product.showSpecs !== false && (
          <Reveal>
            <div id="specs" className="scroll-mt-20">
              <SectionTitle>প্রোডাক্ট স্পেসিফিকেশন</SectionTitle>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                {specs.map((sp, i) => (
                  <div key={i} className={`grid grid-cols-2 text-sm ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <span className="px-5 py-3.5 font-medium text-slate-600 border-r border-slate-200">{sp.label}</span>
                    <span className="px-5 py-3.5 font-bold text-[#1a365d]">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Rating breakdown */}
        {product.showReviews !== false && (
          <Reveal delay={0.1}>
            <div id="reviews" className="scroll-mt-20">
              <SectionTitle>গ্রাহক রিভিউ এবং রেটিং</SectionTitle>
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#1a365d] leading-none">{ratingAverage}<span className="text-2xl text-slate-400">/৫</span></p>
                  <div className="flex justify-center gap-0.5 my-2">
                    {[0, 1, 2, 3, 4].map((s) => <Star key={s} size={15} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[11px] text-slate-500">({ratingCount} জন রিভিউ)</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {ratingBars.map((pct, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <span className="text-slate-500 w-8 whitespace-nowrap">{toBn(5 - i)} স্টার</span>
                      <span className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <span className="block h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="text-slate-400 w-8 text-right">{toBn(pct)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* review cards */}
              <div className="grid sm:grid-cols-3 gap-3">
                {reviews.slice(0, 3).map((r, i) => (
                  <figure key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm">
                    <figcaption className="flex items-center gap-2.5 mb-2">
                      <span className="w-8 h-8 rounded-full bg-[#1a365d] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">{r.name[0]}</span>
                      <span><span className="block text-xs font-bold text-[#1a365d]">{r.name}</span><span className="block text-[9px] text-slate-400">{r.city}</span></span>
                    </figcaption>
                    <div className="flex gap-0.5 mb-1.5">
                      {[0, 1, 2, 3, 4].map((s) => <Star key={s} size={11} className={s < (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />)}
                    </div>
                    <blockquote className="text-[11px] text-slate-600 leading-relaxed flex-1">{r.text}</blockquote>
                    {r.image && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2.5 bg-slate-100">
                        <Image src={r.image} alt={`review ${i}`} fill className="object-cover" />
                      </div>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </section>

      {/* ── Stats row ── */}
      {product.showStats !== false && (
        <section className="max-w-[1400px] mx-auto px-6 py-12">
          <Reveal>
            <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.slice(0, 4).map((st, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-blue-600">{st.value}</p>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">{st.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── The Craft (video + feature bullets) ── */}
      {(product.videoUrl && product.showVideo !== false) && (
        <section className="max-w-[1400px] mx-auto px-6 py-12">
          <Reveal>
            <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative aspect-video md:aspect-auto bg-[#1a365d]">
                <Image src={galleryImages[1]} alt="craft" fill className="object-cover opacity-60" />
                <button onClick={() => { setPlayVideo(true); setTimeout(() => scrollTo('film'), 100); }} className="absolute inset-0 flex items-center justify-center cursor-pointer border-none bg-transparent">
                  <span className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><Play size={24} className="text-blue-600 fill-blue-600 ml-1" /></span>
                </button>
                <div className="absolute top-6 left-6 text-white">
                  <p className="font-bold text-lg">{storeName}</p>
                  <p className="text-sm text-blue-200">কাজ করে যেভাবে</p>
                </div>
              </div>
              <div className="bg-blue-600 text-white p-8 flex flex-col justify-center">
                <p className="text-sm text-blue-100 mb-4">দেখুন কিভাবে {storeName} আপনার প্রয়োজন মেটায় — নিখুঁত পারফরম্যান্স ও নির্ভরযোগ্যতায়।</p>
                <ul className="space-y-2.5">
                  {featuresList.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      <Check size={16} className="text-white flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── FAQ Section (Dedicated full width) ── */}
      {product.showFaqs !== false && (
        <section id="faq" className="max-w-[1400px] mx-auto px-6 py-12 border-b border-slate-100 scroll-mt-20">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a365d]">সাধারণ জিজ্ঞাসা</h2>
              <span className="block h-1 w-16 bg-blue-600 rounded-full mt-3 mx-auto" />
            </div>
          </Reveal>
          <Reveal>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqList.map((f, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer border-none bg-transparent"
                  >
                    <span className="font-bold text-[#1a365d] text-sm sm:text-base">{f.q}</span>
                    <ChevronDown size={18} className={`text-blue-600 flex-shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                        <p className="px-5 pb-5 text-slate-500 text-sm leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Offer Countdown & Checkout Section (2-Column Grid) ── */}
      <section id="order" className="max-w-[1400px] mx-auto px-6 py-16 scroll-mt-20">
        <div className={`grid gap-8 items-start ${
          (product.showOffer !== false && product.showCart !== false)
            ? 'lg:grid-cols-12'
            : 'grid-cols-1 max-w-2xl mx-auto'
        }`}>
          {/* Countdown offer */}
          {product.showOffer !== false && (
            <Reveal className={product.showCart !== false ? 'lg:col-span-5' : 'w-full'}>
              <div className="bg-blue-600 text-white rounded-2xl p-8 text-center shadow-xl shadow-blue-600/10 h-full flex flex-col justify-center">
                <h3 className="font-serif text-xl sm:text-2xl font-bold mb-6">{product.offerTitle || 'সীমিত সময়ের অফার!'}</h3>
                <div className="grid grid-cols-4 gap-2.5 mb-6">
                  {[
                    { v: timeLeft.days, l: 'দিন' },
                    { v: timeLeft.hours, l: 'ঘণ্টা' },
                    { v: timeLeft.minutes, l: 'মিনিট' },
                    { v: timeLeft.seconds, l: 'সেকেন্ড' },
                  ].map((t, i) => (
                    <div key={i} className="bg-white/15 rounded-xl py-3 px-1.5">
                      <p className="text-2xl font-bold tabular-nums leading-none">{toBn(String(t.v).padStart(2, '0'))}</p>
                      <p className="text-[10px] text-blue-100 mt-1.5 font-medium">{t.l}</p>
                    </div>
                  ))}
                </div>
                {product.discount > 0 && (
                  <p className="text-base font-bold mb-5">{toBn(product.discount)}% ছাড় চলছে আজই!</p>
                )}
                <div className="flex items-center justify-center gap-2 text-xs text-blue-100 bg-white/10 rounded-full py-2.5 px-4 max-w-xs mx-auto">
                  <span className="flex -space-x-1.5">{['A', 'R', 'S'].map((l, i) => <span key={i} className="w-5 h-5 rounded-full bg-white/25 text-white text-[8px] font-bold flex items-center justify-center border border-blue-500">{l}</span>)}</span>
                  {toBn('1.2')}K+ জন আজই অর্ডার করেছেন
                </div>
              </div>
            </Reveal>
          )}

          {/* Order form */}
          {product.showCart !== false && (
            <Reveal className={product.showOffer !== false ? 'lg:col-span-7' : 'w-full'}>
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-100/60">
                <h3 className="font-serif text-xl font-bold text-[#1a365d] mb-5">অর্ডার করুন এখনই</h3>
                
                {/* mini summary */}
                <div className="flex gap-4 pb-5 mb-5 border-b border-slate-100">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <Image src={galleryImages[colorsList.indexOf(selectedColor) === -1 ? 0 : colorsList.indexOf(selectedColor)] || galleryImages[0]} alt="summary" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1a365d] text-sm sm:text-base">{sanitizeName(product.name)} ({selectedColor})</p>
                    <div className="flex items-center gap-2 mt-2">
                      {product.discount > 0 && <span className="text-xs text-slate-400 line-through">৳{toBn(Math.round(product.price))}</span>}
                      <span className="text-base font-bold text-blue-600">৳{toBn(Math.round(discountedPrice))}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg border border-slate-300 text-[#1a365d] flex items-center justify-center hover:border-blue-600 cursor-pointer bg-white transition-colors"><Minus size={13} /></button>
                      <span className="w-8 text-center font-bold text-[#1a365d] text-base">{toBn(quantity)}</span>
                      <button type="button" onClick={() => setQuantity((q) => q + 1)} className="w-8 h-8 rounded-lg border border-slate-300 text-[#1a365d] flex items-center justify-center hover:border-blue-600 cursor-pointer bg-white transition-colors"><Plus size={13} /></button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'name', ph: 'আপনার নাম', type: 'text' },
                      { key: 'phone', ph: 'মোবাইল নম্বর (01XXXXXXXXX)', type: 'tel' },
                    ].map((fld) => (
                      <input
                        key={fld.key}
                        type={fld.type}
                        required
                        placeholder={fld.ph}
                        value={(formData as any)[fld.key]}
                        onChange={(e) => setFormData({ ...formData, [fld.key]: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#1a365d] placeholder:text-slate-400 outline-none focus:border-blue-600 transition-colors focus:bg-white"
                      />
                    ))}
                  </div>
                  
                  <input
                    type="text"
                    required
                    placeholder="আপনার সম্পূর্ণ ঠিকানা"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#1a365d] placeholder:text-slate-400 outline-none focus:border-blue-600 transition-colors focus:bg-white"
                  />
                  
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('dhaka')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        deliveryArea === 'dhaka'
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span>ঢাকার ভেতরে</span>
                        <span className="text-blue-600">৳{toBn(deliveryFeeDhaka)}</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryArea('outside')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        deliveryArea === 'outside'
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span>ঢাকার বাইরে</span>
                        <span className="text-blue-600">৳{toBn(deliveryFeeOutside)}</span>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-sm">
                    <div className="flex justify-between text-slate-500"><span>সাবটোটাল</span><span className="text-[#1a365d] font-semibold">৳{toBn(Math.round(discountedPrice * quantity))}</span></div>
                    <div className="flex justify-between text-slate-500"><span>ডেলিভারি চার্জ</span><span className="text-[#1a365d] font-semibold">৳{toBn(deliveryFee)}</span></div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100"><span className="font-bold text-[#1a365d] text-base">সর্বমোট</span><span className="text-xl font-bold text-blue-600">৳{toBn(total)}</span></div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-3.5 rounded-full transition-all active:scale-[0.99] cursor-pointer border-none flex items-center justify-center gap-2 shadow-md">
                    {isSubmitting ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> প্রসেস হচ্ছে...</>) : orderSuccess ? 'অর্ডার সফল হয়েছে ✓' : <><ShoppingBag size={18} /> এখনই অর্ডার করুন</>}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5"><Shield size={13} /> ১০০% নিরাপদ পেমেন্ট ও ক্যাশ অন ডেলিভারি</p>
                  {orderSuccess && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                      <p className="text-xs text-green-800 font-bold">✓ ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে।</p>
                      <p className="text-[11px] text-green-700 font-mono mt-0.5">অর্ডার আইডি: {placedOrderId}</p>
                    </motion.div>
                  )}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {product.storePhone && (
                      <a href={`tel:${product.storePhone}`} className="flex items-center justify-center gap-2 border border-slate-300 hover:border-blue-600 text-[#1a365d] text-xs font-bold py-2.5 rounded-full transition-colors bg-white"><Phone size={14} /> ফোন করুন</a>
                    )}
                    {rawWa && (
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20ba56] text-white text-xs font-bold py-2.5 rounded-full transition-colors"><MessageCircle size={14} /> হোয়াটসঅ্যাপ</a>
                    )}
                  </div>
                </form>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Review submission form ── */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <Reveal>
          <div className="max-w-3xl mx-auto bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a365d] mb-2 text-center">আপনার মূল্যবান মতামত দিন</h3>
            <p className="text-xs text-slate-500 text-center mb-6">আমাদের পণ্য আপনার কেমন লেগেছে? ছবি ও টেক্সটের মাধ্যমে আমাদের জানান!</p>
            <form onSubmit={handleReviewSubmit} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">আপনার নাম <span className="text-red-500">*</span></label>
                <input type="text" placeholder="আপনার নাম লিখুন" required value={reviewName} onChange={(e) => setReviewName(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-blue-600 text-sm transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">শহর / অবস্থান</label>
                <input type="text" placeholder="যেমন: ঢাকা" value={reviewCity} onChange={(e) => setReviewCity(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-blue-600 text-sm transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">টেক্সট রিভিউ</label>
                <textarea rows={2} maxLength={200} placeholder="আপনার মতামত লিখুন..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-blue-600 text-sm transition-all duration-200 resize-none h-[106px]" />
                <p className="text-right text-[10px] text-slate-400 mt-1">{toBn(reviewText.length)}/২০০</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">ছবি রিভিউ (যদি থাকে)</label>
                <div className="w-full border-2 border-dashed border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-center bg-white hover:border-blue-600/40 transition-all duration-250 cursor-pointer h-[106px] group">
                  <Upload size={22} className="text-slate-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:scale-105 mb-1" />
                  <p className="text-[10px] font-bold text-slate-700">এখানে ক্লিক করে ছবি আপলোড করুন</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">সর্বোচ্চ ৩টি ছবি (JPG, PNG)</p>
                </div>
              </div>
              <div className="md:col-span-2 mt-2">
                <button type="submit" className="w-full bg-blue-600 text-white font-bold text-base py-3.5 rounded-lg hover:bg-blue-700 transition-all duration-250 flex justify-center items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer border-none">
                  <Edit className="w-4 h-4 flex-shrink-0" /> রিভিউ সাবমিট করুন
                </button>
                {reviewSubmitted && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-100 rounded-lg p-4 text-center mt-3 shadow-sm">
                    <p className="text-green-800 font-extrabold text-xs">🎉 ধন্যবাদ! আপনার মূল্যবান রিভিউটি সফলভাবে সাবমিট করা হয়েছে।</p>
                  </motion.div>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1a365d] text-white pt-14 pb-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-lg">{storeName[0]}</span>
                <p className="font-bold text-lg">{storeName}</p>
              </div>
              <p className="text-xs text-blue-200 leading-relaxed">{product.storeTagline || 'বিশুদ্ধ পানি, সুস্থ জীবন — প্রতিটি চুমুকে।'}</p>
              {(product.facebookUrl || product.instagramUrl || product.youtubeUrl) && (
                <div className="flex gap-2.5 mt-4">
                  {product.facebookUrl && (
                    <a href={product.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition" title="Facebook">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
                    </a>
                  )}
                  {product.instagramUrl && (
                    <a href={product.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition" title="Instagram">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                    </a>
                  )}
                  {product.youtubeUrl && (
                    <a href={product.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition" title="YouTube">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* quick links */}
            <div>
              <p className="font-bold text-sm mb-3">দ্রুত লিংক</p>
              <ul className="space-y-2 text-xs text-blue-200">
                {navLinks.map((l) => (
                  <li key={l.anchor}><button onClick={() => scrollTo(l.anchor)} className="hover:text-white transition cursor-pointer bg-transparent border-none p-0 text-blue-200">{l.label}</button></li>
                ))}
              </ul>
            </div>

            {/* policy links */}
            <div>
              <p className="font-bold text-sm mb-3">সহায়তা</p>
              <ul className="space-y-2 text-xs text-blue-200">
                <li>যোগাযোগ করুন</li>
                <li>শিপিং পলিসি</li>
                <li>রিটার্ন পলিসি</li>
                <li>শর্তাবলী</li>
              </ul>
            </div>

            {/* contact */}
            <div>
              <p className="font-bold text-sm mb-3">যোগাযোগ</p>
              <ul className="space-y-2 text-xs text-blue-200">
                {product.storePhone && <li className="flex items-center gap-2"><Phone size={12} /> {product.storePhone}</li>}
                {rawWa && <li className="flex items-center gap-2"><MessageCircle size={12} /> <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">Live Chat</a></li>}
              </ul>
            </div>
          </div>

          {/* payment methods */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 py-6 border-t border-white/10">
            <span className="text-xs text-blue-200 mr-1">পেমেন্ট মাধ্যম:</span>
            {paymentMethods.map((m) => (
              <span key={m} className={`bg-white rounded-md px-3 py-1.5 text-xs font-bold ${payColor[m] || 'text-slate-700'}`}>{payLabel[m] || m}</span>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] text-blue-300 gap-3">
            <p>© {toBn(2026)} {storeName}. সকল অধিকার সংরক্ষিত।</p>
            <div className="flex gap-4">
              <span>প্রাইভেসি পলিসি</span>
              <span>শর্তাবলী</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp button ── */}
      {rawWa && (
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-20 right-6 z-50 bg-[#25d366] hover:bg-[#20ba56] text-white p-3 rounded-full shadow-2xl transition duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer" title="WhatsApp-এ মেসেজ দিন">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.978 14.057.955 11.43.955c-5.448 0-9.876 4.372-9.88 9.802-.002 1.73.456 3.42 1.32 4.947L1.93 21.17l5.44-1.416zM15.753 13.06c-.234-.117-1.38-.68-1.597-.76-.217-.08-.375-.12-.533.12-.158.24-.612.76-.75.918-.139.158-.277.177-.51.06-.233-.118-.987-.363-1.879-1.158-.694-.62-1.162-1.385-1.298-1.62-.136-.234-.015-.36.103-.476.105-.104.233-.272.35-.408.117-.136.156-.227.234-.379.078-.152.039-.285-.019-.402-.059-.117-.533-1.285-.73-1.76-.192-.464-.388-.4-.533-.408-.138-.007-.297-.008-.456-.008-.158 0-.416.06-.634.298-.218.238-.83.812-.83 1.982 0 1.17.85 2.298.969 2.457.118.158 1.67 2.547 4.047 3.57.566.244 1.008.39 1.39.497.38.032.74.015 1.012-.03.303-.049.932-.38 1.062-.747.13-.368.13-.683.09-.747-.038-.063-.156-.101-.39-.219z" />
          </svg>
        </a>
      )}
      {/* ── Sticky Mobile Purchase Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black text-[#1a365d] block">
            ৳{toBn(Math.round(discountedPrice))}
          </span>
          <span className="text-[10px] text-slate-500">ক্যাশ অন ডেলিভারি</span>
        </div>
        <button
          type="button"
          onClick={() => scrollTo('order')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer border-none flex items-center gap-1.5"
        >
          <ShoppingBag size={14} /> অর্ডার করুন
        </button>
      </div>
    </motion.div>
  );
}
