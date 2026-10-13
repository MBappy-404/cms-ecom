'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/lib/types';
import {
  ShoppingCart,
  Truck,
  Shield,
  CheckCircle2,
  Phone,
  MessageCircle,
  Play,
  RotateCcw,
  Edit,
  ShoppingBag,
  Star,
  ChevronDown,
  Check,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Template2Props {
  product: Product;
}

export default function Template2({ product }: Template2Props) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const rawWaNumber = product.whatsappNumber || product.storePhone || '';
  const cleanWaNumber = rawWaNumber.replace(/[^\d]/g, '');
  const waLink = `https://wa.me/${cleanWaNumber.startsWith('880') ? cleanWaNumber : cleanWaNumber.startsWith('0') ? '880' + cleanWaNumber.substring(1) : '880' + cleanWaNumber}`;

  const sizesList = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ['M', 'L', 'XL', 'XXL'];

  const outOfStockList = product.outOfStockSizes
    ? product.outOfStockSizes.split(',').map((s: string) => s.trim().toUpperCase())
    : [];

  const colorsList = product.colors && product.colors.length > 0
    ? product.colors
    : ['সাদা', 'বাদামি', 'গাঢ় নীল', 'ধূসর'];

  const [selectedSize, setSelectedSize] = useState(sizesList[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(colorsList[0] || 'সাদা');

  useEffect(() => {
    if (sizesList.length > 0) {
      setSelectedSize(sizesList[0]);
    }
  }, [product.sizes]);

  useEffect(() => {
    if (colorsList.length > 0) {
      setSelectedColor(colorsList[0]);
    }
  }, [product.colors]);

  const [quantity, setQuantity] = useState(1);
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const deliveryFeeDhaka = Number(product.deliveryDhaka) || 60;
  const deliveryFeeOutside = Number(product.deliveryOutside) || 120;
  const deliveryFee = deliveryArea === 'dhaka' ? deliveryFeeDhaka : deliveryFeeOutside;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [reviewType, setReviewType] = useState<'text' | 'photo'>('text');
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('reviews');
    let currentReviews = [];
    if (stored) {
      try {
        currentReviews = JSON.parse(stored);
      } catch (err) { }
    }
    const newReview = {
      id: Date.now().toString(),
      name: reviewName,
      comment: reviewText,
      city: reviewCity || 'ঢাকা',
      date: 'আজই',
      rating: 5,
      approved: true
    };
    localStorage.setItem('reviews', JSON.stringify([newReview, ...currentReviews]));

    setReviewSubmitted(true);
    setReviewText('');
    setReviewName('');
    setReviewCity('');
    setTimeout(() => setReviewSubmitted(false), 6000);
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const toBanglaNum = (num: number | string) => {
    const engNum = String(num);
    const banglaDigits: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return engNum.split('').map(digit => banglaDigits[digit] || digit).join('');
  };

  const galleryImages = [
    product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    product.images[1] || 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&h=800&fit=crop',
    product.images[2] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    product.images[3] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop',
    product.images[4] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop',
  ];

  const getColorHex = (name: string) => {
    if (!name) return '#cbd5e1';
    const clean = name.trim().toLowerCase().replace(/\s+/g, ' ').normalize('NFC');
    const colorMap: { [key: string]: string } = {
      'সাদা': '#ffffff',
      'badami': '#e6c29e',
      'বাদামি': '#e6c29e',
      'গাঢ় নীল': '#0f1e36',
      'ধূসর': '#94a3b8',
      'কালো': '#1e293b',
      'লাল': '#ef4444',
      'নীল': '#3b82f6',
      'সবুজ': '#22c55e',
      'হলুদ': '#eab308',
      'গোলাপি': '#ec4899',
      'কমলা': '#f97316',
      'বেগুনি': '#a855f7',
      'মেরুন': '#7f1d1d',
      'নেভি': '#1e3a8a',
      'নেভি ব্লু': '#1e3a8a',
      'অফ হোয়াইট': '#fafaf9',
      'অফ-হোয়াইট': '#fafaf9',
      'ক্রিম': '#fdf6e2',
      'অলিভ': '#808000',
      'সিলভার': '#cbd5e1',
      'গোল্ডেন': '#d97706',
    };
    const normalizedMap: { [key: string]: string } = {};
    for (const key of Object.keys(colorMap)) {
      normalizedMap[key.normalize('NFC')] = colorMap[key];
    }
    return normalizedMap[clean] || clean;
  };

  const selectedColorIndex = colorsList.indexOf(selectedColor);
  const activeColorIdx = selectedColorIndex !== -1 ? selectedColorIndex : 0;

  useEffect(() => {
    const idx = colorsList.indexOf(selectedColor);
    if (idx !== -1 && idx < galleryImages.length) {
      setActiveGalleryIndex(idx);
    }
  }, [selectedColor, colorsList, galleryImages.length]);

  const featuresList = product.features && product.features.length > 0
    ? product.features
    : [
      'আধুনিক কাটিং ও প্রিমিয়াম ফিনিশিং',
      'শতভাগ আরামদায়ক কটন ফ্যাব্রিক',
      'দীর্ঘস্থায়ী স্থায়িত্ব ও কালার গ্যারান্টি',
      'স্মার্ট ক্যাজুয়াল ও পার্টি ওয়্যার লুক',
      'সহজ ক্যাশ অন ডেলিভারি ও দ্রুত ডেলিভারি',
    ];

  const textReviews = storeReviews.length > 0
    ? storeReviews.filter(r => r.approved)
    : [
      {
        name: 'তাহমিদ হাসান',
        city: 'মিরপুর, ঢাকা',
        comment: 'প্যাকেজিং এবং পণ্যের মান দুটোই দারুণ ছিল। কালার ছবির সাথে একদম ম্যাচ করেছে।',
        date: 'গতকাল',
        rating: 5,
      },
      {
        name: 'আরিফুল ইসলাম',
        city: 'খুলনা সদর',
        comment: 'কাপড়ের টেক্সচার খুব স্মুথ এবং ফিটিং নিখুঁত। সময়মতো ডেলিভারি পেয়েছি।',
        date: '৩ দিন আগে',
        rating: 5,
      },
      {
        name: 'সোহাগ রানা',
        city: 'সিলেট',
        comment: 'প্রোডাক্ট হাতে দেখে টাকা দেওয়ার ব্যবস্থাটা সবচেয়ে ভালো লেগেছে। ধন্যবাদ!',
        date: '৫ দিন আগে',
        rating: 5,
      },
    ];

  const photoReviews = [
    'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=450&h=350&fit=crop',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=450&h=350&fit=crop',
    'https://images.unsplash.com/photo-1581582801907-742a9acc5a1d?w=450&h=350&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=450&h=350&fit=crop',
  ];

  const faqList = product.faqs && product.faqs.length > 0
    ? product.faqs
    : [
      {
        q: 'অর্ডারের জন্য অগ্রিম পেমেন্ট করতে হয় কি?',
        a: 'না, কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ ক্যাশ অন ডেলিভারিতে মূল্য পরিশোধ করতে পারবেন।'
      },
      {
        q: 'ডেলিভারি চার্জ কত এবং কতদিনে পৌঁছাবে?',
        a: 'ঢাকার ভেতরে ডেলিভারি চার্জ মাত্র ৬০ টাকা (১-২ দিনে) এবং ঢাকার বাইরে ১২০ টাকা (২-৩ দিনে)।'
      },
      {
        q: 'পছন্দ না হলে বা সাইজে সমস্যা হলে কি রিটার্ন করা যায়?',
        a: 'জি, ডেলিভারি ম্যানের সামনে দেখে নিতে পারেন অথবা ৭ দিনের মধ্যে সহজে এক্সচেঞ্জ করতে পারবেন।'
      }
    ];

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

  const scrollToOrder = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
    setPlayVideo(true);
    setTimeout(() => {
      document.getElementById('product-video')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <motion.div
      key="template2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white"
    >
      {/* ── 1. Modern Header ── */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/20">
              {(product.storeName || 'S')[0]}
            </div>
            <div>
              <h1 className="font-black text-base sm:text-xl text-slate-900 tracking-tight leading-tight">
                {product.storeName || 'মডার্ন স্টোর'}
              </h1>
              <p className="text-[10px] sm:text-xs text-indigo-600 font-bold leading-none mt-0.5">
                {product.storeTagline || 'স্মার্ট অনলাইন শপিং'}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-indigo-600" /> হোম ডেলিভারি</span>
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-600" /> ক্যাশ অন ডেলিভারি</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={14} className="text-amber-600" /> ৭ দিনে এক্সচেঞ্জ</span>
          </nav>

          <div className="flex items-center gap-3">
            {product.storePhone && (
              <a
                href={`tel:${product.storePhone}`}
                className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all shadow-xs"
              >
                <Phone size={13} className="text-indigo-600" />
                <span className="hidden sm:inline font-mono">{product.storePhone}</span>
                <span className="sm:hidden">কল করুন</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Modern Hero Showcase ── */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-bold">
                  <Sparkles size={13} /> {product.heroEyebrow || 'প্রিমিয়াম কালেকশন'}
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                  <Zap size={12} fill="currentColor" /> রেডি স্টক
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                {product.heroTitle || product.name}
              </h2>
              {product.heroSubtitle && (
                <p className="text-sm sm:text-base font-bold text-indigo-600 mt-1.5">{product.heroSubtitle}</p>
              )}

              <div className="flex items-center gap-2.5 mt-3 text-xs text-slate-600">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="font-extrabold text-slate-900">৪.৯/৫</span>
                <span className="text-slate-400">• ১,২৫০+ সন্তুষ্ট কাস্টমার</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    ৳{toBanglaNum(Math.round(discountedPrice))}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                      ৳{toBanglaNum(Math.round(product.price))}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-indigo-600" /> ক্যাশ অন ডেলিভারি | পণ্য দেখে টাকা দিন
                </p>
              </div>

              {product.discount > 0 && (
                <div className="bg-indigo-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm">
                  {toBanglaNum(product.discount)}% অফার
                </div>
              )}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description ||
                'উন্নতমানের নিখুঁত কাপড়, আধুনিক কাটিং ও আকর্ষণীয় ফিটিংস— যা প্রতিটি ব্যবহারের ক্ষেত্রে আপনাকে দেবে শতভাগ সন্তুষ্টি ও প্রিমিয়াম লুক।'}
            </p>

            {/* Size Selector */}
            {product.showSizes !== false && sizesList.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-900">সাইজ নির্বাচন করুন:</span>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map((size: string) => {
                    const isOutOfStock = outOfStockList.includes(size.trim().toUpperCase());
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-11 h-10 px-3 rounded-xl font-black text-xs transition-all border cursor-pointer ${
                          isOutOfStock
                            ? 'border-slate-200 bg-slate-100 text-slate-400 line-through opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.showColors !== false && colorsList.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-900">
                  রং: <span className="text-indigo-600 font-bold">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {colorsList.map((colorName: string, idx: number) => {
                    const hex = getColorHex(colorName);
                    const isSelected = selectedColor === colorName;
                    return (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => {
                          setSelectedColor(colorName);
                          if (idx < galleryImages.length) setActiveGalleryIndex(idx);
                        }}
                        className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center shadow-xs ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/30 ring-offset-2 scale-110'
                            : 'border-slate-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: hex }}
                        title={colorName}
                      >
                        {isSelected && (
                          <Check size={14} className={hex === '#ffffff' || hex === '#fafaf9' ? 'text-slate-900' : 'text-white'} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stepper & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black text-sm text-slate-900">
                    {toBanglaNum(quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => p + 1)}
                    className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={scrollToOrder}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-center justify-center gap-2 border-none"
                >
                  <ShoppingCart size={18} /> অর্ডার কনফার্ম করুন
                </button>
              </div>

              {product.showVideo !== false && product.videoUrl && (
                <button
                  type="button"
                  onClick={scrollToVideo}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play size={14} className="text-indigo-600 fill-indigo-600" /> প্রোডাক্ট ভিডিও দেখুন
                </button>
              )}
            </div>
          </div>

          {/* Right Gallery Showcase */}
          <div className="lg:col-span-6 space-y-4 max-w-[540px] mx-auto w-full">
            <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGalleryIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={galleryImages[activeGalleryIndex]}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/20">
                  {toBanglaNum(activeGalleryIndex + 1)} / {toBanglaNum(galleryImages.length)}
                </span>
              </div>

              {/* Prev/Next arrows */}
              <button
                type="button"
                onClick={() => {
                  setActiveGalleryIndex((p) => (p > 0 ? p - 1 : galleryImages.length - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md cursor-pointer z-10"
              >
                ❮
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveGalleryIndex((p) => (p < galleryImages.length - 1 ? p + 1 : 0));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md cursor-pointer z-10"
              >
                ❯
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2.5">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveGalleryIndex(i);
                    if (colorsList[i]) setSelectedColor(colorsList[i]);
                  }}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeGalleryIndex === i
                      ? 'border-indigo-600 ring-2 ring-indigo-500/25 scale-102'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. Trust Cards Strip ── */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 mb-10 sm:mb-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">দ্রুত ডেলিভারি</h4>
              <p className="text-[10px] sm:text-xs text-slate-500">সারাদেশে হোম ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-[10px] sm:text-xs text-slate-500">পণ্য দেখে মূল্য পরিশোধ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">সহজ রিটার্ন</h4>
              <p className="text-[10px] sm:text-xs text-slate-500">৭ দিনের এক্সচেঞ্জ গ্যারান্টি</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">২৪/৭ সাপোর্ট</h4>
              <p className="text-[10px] sm:text-xs text-slate-500">সরাসরি কল ও চ্যাট</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Video & Features Split ── */}
      {(product.showVideo !== false || product.showFeatures !== false) && (
        <section id="product-video" className="max-w-[1360px] mx-auto px-4 sm:px-6 mb-10 sm:mb-14 scroll-mt-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {product.showVideo !== false && product.videoUrl && (
                <div className="lg:col-span-6 space-y-3">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">ভিডিও রিভিউ দেখে নিশ্চিত হোন</h3>
                  {playVideo ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                      <iframe
                        src={product.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setPlayVideo(true)}
                      className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-lg flex items-center justify-center"
                    >
                      <Image
                        src={galleryImages[1] || galleryImages[0]}
                        alt="Video Thumbnail"
                        fill
                        className="object-cover opacity-60 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="relative z-10 w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={24} className="fill-indigo-600 ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={product.showVideo !== false && product.videoUrl ? 'lg:col-span-6 space-y-4' : 'lg:col-span-12 max-w-3xl mx-auto space-y-4'}>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  আমাদের প্রোডাক্টের বিশেষ সুবিধাসমূহ
                </h3>
                <ul className="space-y-3">
                  {featuresList.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700">
                      <CheckCircle2 size={16} className="text-indigo-600 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── 5. Customer Reviews ── */}
      {product.showReviews !== false && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 mb-10 sm:mb-14">
          <div className="text-center max-w-lg mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">কাস্টমারদের সন্তুষ্টির রিভিউ</h3>
            <div className="inline-flex bg-slate-200 p-1 rounded-xl mt-4">
              <button
                type="button"
                onClick={() => setReviewType('text')}
                className={`px-5 py-2 rounded-lg text-xs font-black cursor-pointer ${
                  reviewType === 'text' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                টেক্সট রিভিউ
              </button>
              <button
                type="button"
                onClick={() => setReviewType('photo')}
                className={`px-5 py-2 rounded-lg text-xs font-black cursor-pointer ${
                  reviewType === 'photo' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                ছবি রিভিউ
              </button>
            </div>
          </div>

          {reviewType === 'text' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {textReviews.slice(0, 3).map((r, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{r.name}</h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">ভেরিফায়েড</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                  <p className="text-[10px] text-slate-400">{r.city} • {r.date || '২ দিন আগে'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photoReviews.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <Image src={img} alt={`Photo review ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Add Review */}
          <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 text-center mb-4">আপনার অভিজ্ঞতা শেয়ার করুন</h4>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="আপনার নাম"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600"
                />
                <input
                  type="text"
                  required
                  placeholder="শহর"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
              <textarea
                required
                rows={2}
                placeholder="আপনার মন্তব্য লিখুন..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit size={13} /> রিভিউ সাবমিট
              </button>
              {reviewSubmitted && (
                <p className="text-xs text-emerald-700 font-bold text-center">✓ আপনার রিভিউ জমা হয়েছে!</p>
              )}
            </form>
          </div>
        </section>
      )}

      {/* ── 6. FAQ Section ── */}
      {product.showFaqs !== false && faqList.length > 0 && (
        <section className="max-w-[850px] mx-auto px-4 sm:px-6 mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-slate-900">সাধারণ প্রশ্ন ও উত্তর</h3>
          </div>
          <div className="space-y-2.5">
            {faqList.map((f, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 7. Checkout Form ── */}
      <section id="order-form" className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-10 mb-14 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black px-3.5 py-1 rounded-full inline-block mb-2">
            ১০০% ক্যাশ অন ডেলিভারি
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            অর্ডার করতে আপনার বিবরণ দিন
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করবেন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="আপনার পুরো নাম"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ঠিকানা *</label>
                  <input
                    type="text"
                    required
                    placeholder="আপনার পূর্ণ ঠিকানা (বাসা/রোড, এলাকা)"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Delivery Zone Cards */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">ডেলিভারি এলাকা *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('dhaka')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryArea === 'dhaka'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-slate-900">ঢাকার ভেতরে</span>
                      <span className="font-black text-xs text-indigo-600">৳{toBanglaNum(deliveryFeeDhaka)}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryArea === 'outside'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-slate-900">ঢাকার বাইরে</span>
                      <span className="font-black text-xs text-indigo-600">৳{toBanglaNum(deliveryFeeOutside)}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Variant confirmation */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">সাইজ</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    {sizesList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">রং</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    {colorsList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">পরিমাণ</label>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 h-[34px] px-2">
                    <button type="button" onClick={() => setQuantity((p) => Math.max(1, p - 1))} className="w-5 h-5 bg-white font-bold text-xs rounded">
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-xs">{toBanglaNum(quantity)}</span>
                    <button type="button" onClick={() => setQuantity((p) => p + 1)} className="w-5 h-5 bg-white font-bold text-xs rounded">
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>প্রসেস হচ্ছে...</span>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> এখনই অর্ডার কনফার্ম করুন
                    </>
                  )}
                </button>
              </div>

              {orderSuccess && (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 text-center space-y-1">
                  <h4 className="text-sm font-black text-emerald-900">অর্ডার সফলভাবে গৃহীত হয়েছে!</h4>
                  <p className="text-xs text-emerald-800 font-mono font-bold">অর্ডার আইডি: {placedOrderId}</p>
                </div>
              )}
            </form>
          </div>

          {/* Receipt Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl sticky top-28 space-y-5">
              <h4 className="text-base font-black border-b border-slate-800 pb-3">অর্ডার বিবরণ</h4>

              <div className="flex gap-3.5 items-center bg-slate-800/60 p-3 rounded-2xl">
                <div className="relative w-14 h-18 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0">
                  <Image src={galleryImages[activeColorIdx] || galleryImages[0]} alt="Mini thumb" fill className="object-cover" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">{product.name}</h5>
                  <p className="text-xs text-slate-300">সাইজ: {selectedSize} | কালার: {selectedColor}</p>
                  <p className="text-xs text-indigo-400 font-bold">{toBanglaNum(quantity)} টি × ৳{toBanglaNum(Math.round(discountedPrice))}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 border-b border-slate-800 pb-4">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span className="font-bold text-white">৳{toBanglaNum(Math.round(discountedPrice * quantity))}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-bold text-white">৳{toBanglaNum(deliveryFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-medium">সর্বমোট মূল্য</span>
                <span className="text-2xl font-black text-white">
                  ৳{toBanglaNum(Math.round(discountedPrice * quantity) + deliveryFee)}
                </span>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
                <p>✓ ক্যাশ অন ডেলিভারি সুবিধা</p>
                <p>✓ পণ্য হাতে পেয়ে চেক করে টাকা দিন</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {product.storePhone && (
                  <a href={`tel:${product.storePhone}`} className="bg-slate-800 hover:bg-slate-700 text-center py-2 rounded-xl text-xs font-bold text-white">
                    কল করুন
                  </a>
                )}
                {rawWaNumber && (
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-[#25d366] hover:bg-[#20ba56] text-center py-2 rounded-xl text-xs font-bold text-white">
                    হোয়াটসঅ্যাপ
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 8. Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© ২০২৬ {product.storeName || 'অনলাইন শপ'}. সর্বস্বত্ব সংরক্ষিত।</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white cursor-pointer">
            উপরে স্ক্রোল করুন ↑
          </button>
        </div>
      </footer>

      {/* ── 9. Sticky Mobile Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black text-slate-900 block">
            ৳{toBanglaNum(Math.round(discountedPrice))}
          </span>
          <span className="text-[10px] text-slate-500">ক্যাশ অন ডেলিভারি</span>
        </div>
        <button
          type="button"
          onClick={scrollToOrder}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer border-none flex items-center gap-1.5"
        >
          <ShoppingBag size={14} /> অর্ডার করুন
        </button>
      </div>

    </motion.div>
  );
}
