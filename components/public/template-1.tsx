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
  ShoppingBag,
  Star,
  ChevronDown,
  ChevronRight,
  Check,
  Clock,
  Sparkles,
  User,
  MapPin,
  Lock,
  Headphones,
  Award,
  FileText,
  HelpCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface Template1Props {
  product: Product;
}

export default function Template1({ product }: Template1Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [activeReviewDot, setActiveReviewDot] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const rawWaNumber = product.whatsappNumber || product.storePhone || '';
  const cleanWaNumber = rawWaNumber.replace(/[^\d]/g, '');
  const waLink = `https://wa.me/${cleanWaNumber.startsWith('880') ? cleanWaNumber : cleanWaNumber.startsWith('0') ? '880' + cleanWaNumber.substring(1) : '880' + cleanWaNumber}`;

  const sizesList = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ['8GB', '16GB', '32GB'];

  const outOfStockList = product.outOfStockSizes
    ? product.outOfStockSizes.split(',').map((s: string) => s.trim().toUpperCase())
    : [];

  const colorsList = product.colors && product.colors.length > 0
    ? product.colors
    : ['কালো', 'সিলভার', 'গাঢ় নীল', 'ধূসর'];

  const [selectedSize, setSelectedSize] = useState(sizesList[0] || '8GB');
  const [selectedColor, setSelectedColor] = useState(colorsList[0] || 'কালো');

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
  const deliveryFeeDhaka = Number(product.deliveryDhaka) || 0;
  const deliveryFeeOutside = Number(product.deliveryOutside) || 120;
  const deliveryFee = deliveryArea === 'dhaka' ? deliveryFeeDhaka : deliveryFeeOutside;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const isLaptop = (product.name || '').toLowerCase().includes('laptop') || 
                   (product.name || '').toLowerCase().includes('macbook') ||
                   (product.category || '').toLowerCase().includes('laptop');

  const defaultLaptopImages = [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop', // MacBook front with code
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop', // MacBook keyboard & trackpad
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop', // MacBook sleek side profile
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=800&fit=crop', // MacBook on modern desk
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop', // MacBook aluminum finish
  ];

  const galleryImages = (() => {
    // If product has multiple uploaded images, strictly use them
    if (product.images && product.images.length > 1) {
      return product.images.filter(Boolean);
    }
    // If it's laptop / tech demo, provide 5 consistent laptop angles
    if (isLaptop) {
      return [
        product.images?.[0] || defaultLaptopImages[0],
        defaultLaptopImages[1],
        defaultLaptopImages[2],
        defaultLaptopImages[3],
        defaultLaptopImages[4],
      ];
    }
    // Single image product
    if (product.images && product.images.length === 1 && product.images[0]) {
      return [product.images[0]];
    }
    if (product.image) {
      return [product.image];
    }
    return defaultLaptopImages;
  })();

  const getColorHex = (name: string) => {
    if (!name) return '#cbd5e1';
    const clean = name.trim().toLowerCase().replace(/\s+/g, ' ').normalize('NFC');
    const colorMap: { [key: string]: string } = {
      'সাদা': '#ffffff',
      'badami': '#e6c29e',
      'বাদামি': '#e6c29e',
      'গাঢ় নীল': '#1e3a8a',
      'ধূসর': '#64748b',
      'কালো': '#0f172a',
      'লাল': '#ef4444',
      'নীল': '#2563eb',
      'সবুজ': '#10b981',
      'হলুদ': '#eab308',
      'গোলাপি': '#ec4899',
      'কমলা': '#f97316',
      'বেগুনি': '#8b5cf6',
      'মেরুন': '#881337',
      'নেভি': '#172554',
      'স্পেস গ্রে': '#475569',
      'সিলভার': '#e2e8f0',
      'গোল্ডেন': '#f59e0b',
    };
    const normalizedMap: { [key: string]: string } = {};
    for (const key of Object.keys(colorMap)) {
      normalizedMap[key.normalize('NFC')] = colorMap[key];
    }
    return normalizedMap[clean] || clean;
  };

  const selectedColorIndex = colorsList.indexOf(selectedColor);

  useEffect(() => {
    const idx = colorsList.indexOf(selectedColor);
    if (idx !== -1 && idx < galleryImages.length) {
      setCurrentImage(idx);
    }
  }, [selectedColor, colorsList, galleryImages.length]);

  const featuresList = product.features && product.features.length > 0
    ? product.features
    : [
      'প্রিমিয়াম বিল্ড কোয়ালিটি ও দীর্ঘস্থায়ী পারফরম্যান্স',
      'পাওয়ারফুল প্রসেসর, দ্রুত মাল্টিটাস্কিং',
      'স্টাইলিশ ও পোর্টেবল ডিজাইন',
      'দীর্ঘ ব্যাটারি লাইফ',
      'ডেভেলপার ফ্রেন্ডলি ও ক্রিয়েটিভ কাজের ফিট',
      'অফিস, স্টাডি, গেমিং, ভিডিও এডিটিং - সব কাজের জন্য পারফেক্ট',
    ];

  const textReviews = [
    {
      name: 'রাকিবুল ইসলাম',
      role: 'ঢাকা',
      comment: 'ল্যাপটপটি সত্যিই অসাধারণ! পারফরমেন্স, কোটিং এবং ব্যাটারি ব্যাকআপ খুব ভালো। ডেলিভারি ও প্যাকেজিং প্রশংসনীয় ছিল।',
      date: '১২ আগস্ট ২০২৪',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      rating: 5,
    },
    {
      name: 'সাজ্জাদ হোসেন',
      role: 'চট্টগ্রাম',
      comment: 'পারফরম্যান্স এক কথায় দুর্দান্ত। বড় প্রজেক্টেও কোনো প্রকার ল্যাগ নেই। ব্যাটারি সাপোর্টে দারুণ সন্তুষ্ট!',
      date: '০৪ আগস্ট ২০২৪',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop',
      rating: 5,
    },
    {
      name: 'নাছিমা আক্তার',
      role: 'রাজশাহী',
      comment: 'ডিজাইন, স্পিড এবং ব্যাটারি লাইফ সবই চমৎকার। এই প্রাইস রেঞ্জে এমন ভালো ল্যাপটপ পাওয়া কঠিন।',
      date: '০২ আগস্ট ২০২৪',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
      rating: 5,
    },
  ];

  const faqList = product.faqs && product.faqs.length > 0
    ? product.faqs
    : [
      {
        q: 'ডেলিভারি পেতে কত দিন লাগবে?',
        a: 'ঢাকার ভেতরে সাধারণ ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২ থেকে ৩ কার্যদিবসের মধ্যে দ্রুত ডেলিভারি সম্পন্ন হয়।'
      },
      {
        q: 'রিটার্ন পলিসি কি?',
        a: 'পণ্য পাওয়ার পর কোনো ত্রুটি দেখা দিলে ৭ দিনের মধ্যে সম্পূর্ণ বিনামূল্যে রিটার্ন অথবা এক্সচেঞ্জের সুবিধা রয়েছে।'
      },
      {
        q: 'ক্যাশ অন ডেলিভারি কি সব জেলায় পাওয়া যাবে?',
        a: 'জি, সমগ্র বাংলাদেশের সকল জেলা ও উপজেলায় ক্যাশ অন ডেলিভারি সুবিধা চালু রয়েছে।'
      },
      {
        q: 'কোন কোন পেমেন্ট মেথড রয়েছে?',
        a: 'ক্যাশ অন ডেলিভারি (COD) ছাড়াও বিকাশ, নগদ, রকেট এবং যে কোনো ডেবিট/ক্রেডিট কার্ডের মাধ্যমে পেমেন্ট করতে পারবেন।'
      },
      {
        q: 'পণ্যটি কি অরিজিনাল?',
        a: 'আমরা শতভাগ আসল ও অথেন্টিক প্রোডাক্ট সরবরাহ করি। প্রতিটি প্রোডাক্টের সাথে অফিশিয়াল ওয়্যারেন্টি রয়েছে।'
      },
      {
        q: 'বাল্ক অর্ডার করা যাবে কি?',
        a: 'জি, পাইকারি বা বাল্ক অর্ডারের জন্য আমাদের হেল্পলাইনে সরাসরি যোগাযোগ করতে পারেন।'
      },
      {
        q: 'ওয়ারেন্টি আছে কি?',
        a: 'জি, প্রতিটি পণ্যের সাথে প্রস্তুতকারক প্রদত্ত নির্দিষ্ট মেয়াদের অফিসিয়াল ওয়ারেন্টি সুবিধা রয়েছে।'
      },
      {
        q: 'আরও কোন প্রশ্ন? যোগাযোগ করুন',
        a: 'যেকোনো প্রশ্নের জন্য আমাদের হটলাইনে কল করুন অথবা হোয়াটসঅ্যাপে তাৎক্ষণিক মেসেজ পাঠান।'
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
          name: `${product.name} (${selectedSize ? `স্টোরেজ: ${selectedSize}` : ''}${selectedColor ? `, রং: ${selectedColor}` : ''})`,
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white pb-0 overflow-x-hidden">
      
      {/* ── 1. Navbar Header ── */}
      <header className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2 relative z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-blue-100 shadow-md shadow-blue-500/5 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25 flex-shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 block leading-tight tracking-tight">
                {product.storeName || 'পণ্যবাজার'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block leading-none mt-0.5">
                {product.storeTagline || 'বিশ্বস্ত ডিজিটাল পণ্য বাজার'}
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600">
            <button onClick={() => scrollToSection('product-details')} className="hover:text-blue-600 transition cursor-pointer">পণ্যের বিবরণ</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition cursor-pointer">বিশেষত্ব</button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-blue-600 transition cursor-pointer">রিভিউ</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-blue-600 transition cursor-pointer">FAQ</button>
            <button onClick={() => scrollToSection('order-form')} className="hover:text-blue-600 transition cursor-pointer">অর্ডার করুন</button>
          </nav>

          {/* Right Support + Buy CTA */}
          <div className="flex items-center gap-3">
            {product.storePhone ? (
              <a
                href={`tel:${product.storePhone}`}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-full transition cursor-pointer"
              >
                <Headphones size={14} className="text-blue-600" />
                <span>সাপোর্ট ২৪/৭</span>
              </a>
            ) : null}

            <button
              onClick={() => scrollToSection('order-form')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 sm:px-6 py-2.5 rounded-full shadow-md shadow-blue-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-1.5 border-none"
            >
              <span>এখনই অর্ডার করুন</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </header>

      {/* ── 2. Main Product Showcase Hero ── */}
      <section id="product-details" className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-3xl border border-blue-100/80 shadow-xl shadow-blue-500/5 p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4 max-w-[540px] mx-auto w-full">
            <div className="relative aspect-[4/3] sm:aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group shadow-inner">
              
              {/* Badges on main image */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="bg-blue-600 text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-md">
                  {product.heroEyebrow || 'বেস্ট সেলিং'}
                </span>
              </div>

              <div className="absolute top-4 right-4 z-20 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
                {currentImage + 1}/{galleryImages.length}
              </div>

              {/* Smooth Animated Image Slider */}
              <div className="relative w-full h-full overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, x: slideDirection === 'right' ? 35 : -35, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: slideDirection === 'right' ? -35 : 35, scale: 0.98 }}
                    transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -40) {
                        setSlideDirection('right');
                        setCurrentImage((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                      } else if (info.offset.x > 40) {
                        setSlideDirection('left');
                        setCurrentImage((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                      }
                    }}
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
                  >
                    <Image
                      src={galleryImages[currentImage] || galleryImages[0]}
                      alt={product.name}
                      fill
                      priority
                      draggable={false}
                      className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prev / Next buttons with smooth transitions */}
              <button
                type="button"
                onClick={() => {
                  setSlideDirection('left');
                  setCurrentImage((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-20 hover:text-blue-600 hover:shadow-xl"
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => {
                  setSlideDirection('right');
                  setCurrentImage((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-20 hover:text-blue-600 hover:shadow-xl"
                aria-label="Next slide"
              >
                ›
              </button>

              {/* Zoom badge at bottom right */}
              <div className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center text-xs pointer-events-none">
                ⤢
              </div>
            </div>

            {/* Thumbnail selector with smooth hover and active scale */}
            <div className="grid grid-cols-5 gap-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSlideDirection(idx >= currentImage ? 'right' : 'left');
                    setCurrentImage(idx);
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer bg-slate-50 ${
                    currentImage === idx
                      ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:scale-102 hover:border-slate-300'
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details & Variant Selectors */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
            
            {/* Category breadcrumb */}
            <div>
              <span className="text-xs font-bold text-blue-600 block mb-1">
                {product.category || 'ইলেকট্রনিক্স'} &gt; {product.name}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                প্রিমিয়াম কোয়ালিটির {product.name}
              </h1>

              {/* Rating strip */}
              <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
                <div className="flex text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-slate-700">
                  ৪.৮/৫ (১,২৪৫ রিভিউ)
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Check size={11} /> বিশ্বস্ত বিক্রেতা
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#f0f6ff]/70 border border-blue-100 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-blue-600">
                    ৳{toBanglaNum(Math.round(discountedPrice))}
                  </span>
                  {product.discount ? (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ৳{toBanglaNum(product.price)}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-blue-500" />
                  <span>অফার শেষ হতে আর ২ দিন বাকি</span>
                </p>
              </div>

              {product.discount ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl">
                  {toBanglaNum(product.discount)}% ছাড়
                </div>
              ) : null}
            </div>

            {/* 4 Micro Feature badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="border border-slate-200/90 rounded-xl p-2 text-center bg-slate-50/50">
                <Truck size={14} className="mx-auto text-blue-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700 block leading-tight">ফ্রি ডেলিভারি</span>
              </div>
              <div className="border border-slate-200/90 rounded-xl p-2 text-center bg-slate-50/50">
                <Shield size={14} className="mx-auto text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700 block leading-tight">ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="border border-slate-200/90 rounded-xl p-2 text-center bg-slate-50/50">
                <RotateCcw size={14} className="mx-auto text-amber-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700 block leading-tight">৭ দিনের রিটার্ন</span>
              </div>
              <div className="border border-slate-200/90 rounded-xl p-2 text-center bg-slate-50/50">
                <Award size={14} className="mx-auto text-purple-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700 block leading-tight">অরিজিনাল পণ্য</span>
              </div>
            </div>

            {/* Sizes / Storage options */}
            {sizesList.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-extrabold text-slate-900 block">
                  স্টোরেজ/সাইজ সিলেক্ট করুন:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map((sz) => {
                    const isOutOfStock = outOfStockList.includes(sz.toUpperCase());
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                            : isOutOfStock
                            ? 'bg-slate-100 text-slate-300 line-through cursor-not-allowed border border-slate-200'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:scale-102'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colorsList.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-900 block">
                  রং সিলেক্ট করুন: <span className="text-blue-600 font-bold">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {colorsList.map((colorName, idx) => {
                    const hex = getColorHex(colorName);
                    const isSelected = selectedColor === colorName;
                    return (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => {
                          setSelectedColor(colorName);
                          if (idx < galleryImages.length) {
                            setSlideDirection(idx >= currentImage ? 'right' : 'left');
                            setCurrentImage(idx);
                          }
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/40 ring-offset-2 scale-110 shadow-md'
                            : 'border-slate-300 hover:scale-110 hover:shadow-sm'
                        }`}
                        style={{ backgroundColor: hex }}
                        title={colorName}
                      >
                        {isSelected && (
                          <Check size={13} className={hex === '#ffffff' || hex === '#e2e8f0' ? 'text-slate-900' : 'text-white'} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stepper + Order Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-100 hover:text-blue-600 active:scale-90 transition-all duration-200 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black text-sm text-slate-900">
                    {toBanglaNum(quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => p + 1)}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-100 hover:text-blue-600 active:scale-90 transition-all duration-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToSection('order-form')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-102 hover:shadow-xl hover:shadow-blue-500/30 active:scale-97 cursor-pointer flex items-center justify-center gap-2 border-none"
                >
                  <ShoppingCart size={18} />
                  <span>এখনই অর্ডার করুন</span>
                </button>
              </div>

              {/* COD secondary button */}
              <button
                type="button"
                onClick={() => scrollToSection('order-form')}
                className="w-full bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-black text-xs sm:text-sm py-3 rounded-xl border border-blue-200 transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap size={14} className="text-blue-600" />
                <span>ক্যাশ অন ডেলিভারিতে অর্ডার করুন</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-1">
                <Lock size={12} className="text-emerald-500" />
                <span>আপনার তথ্য ১০০% নিরাপদ | SSL দ্বারা সুরক্ষিত</span>
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. Trust Strip (4 Highlights) ── */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 mb-12 relative z-10">
        <div className="bg-white rounded-2xl sm:rounded-full border border-blue-100 shadow-md shadow-blue-500/5 px-6 sm:px-10 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Truck size={18} />
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">ফ্রি ডেলিভারি</span>
              <span className="text-[11px] text-slate-400">সারা বাংলাদেশ</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">ক্যাশ অন ডেলিভারি</span>
              <span className="text-[11px] text-slate-400">পণ্য হাতে পেয়ে পেমেন্ট</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw size={18} />
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">৭ দিনের রিটার্ন</span>
              <span className="text-[11px] text-slate-400">কোন ঝামেলা ছাড়াই</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Award size={18} />
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">অরিজিনাল প্রোডাক্ট</span>
              <span className="text-[11px] text-slate-400">১০০% নিশ্চিত</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. Live Video & Key Features Split ── */}
      <section id="features" className="max-w-[1360px] mx-auto px-4 sm:px-6 mb-12 scroll-mt-24 relative z-10">
        <div className="bg-white rounded-3xl border border-blue-100/80 shadow-xl shadow-blue-500/5 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Video */}
            <div className="lg:col-span-6 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">প্রোডাক্টের লাইভ ভিডিও দেখুন</h3>
                </div>
                <p className="text-xs text-slate-500">আসল পণ্য কেমন, কিভাবে কাজ করে — দেখে নিন</p>
              </div>

              {playVideo && product.videoUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-md">
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
                  className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-lg flex items-center justify-center border border-slate-200"
                >
                  <Image
                    src={galleryImages[1] || galleryImages[0]}
                    alt="Video Cover"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-50 transition"
                  />
                  <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play size={26} className="fill-blue-600 ml-1" />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-4 bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-1.5"
                  >
                    <span>পণ্যের ভিডিও দেখুন</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Key Features list */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  কেন আমাদের {product.name} সেরা?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  প্রফেশনাল, স্টুডেন্ট এবং ক্রিয়েটিভদের জন্য পারফেক্ট চয়েস
                </p>
              </div>

              <div className="space-y-2.5">
                {featuresList.map((f, i) => (
                  <div key={i} className="bg-[#f0f6ff]/70 hover:bg-[#e4efff] border border-blue-100/80 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xs hover:translate-x-1 transition-all duration-300">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Check size={14} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. Customer Reviews Section ── */}
      <section id="reviews" className="max-w-[1360px] mx-auto px-4 sm:px-6 mb-16 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="bg-blue-100/70 text-blue-700 text-xs font-bold px-3.5 py-1 rounded-full inline-block mb-2">
            আমাদের গ্রাহকদের মতামত
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            কাস্টমারদের বাস্তব রিভিউ
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            হাজারো সন্তুষ্ট কাস্টমার আস্থা আমাদের শক্তি
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
          {textReviews.map((r, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border shadow-md p-5 sm:p-6 space-y-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                activeReviewDot === i ? 'border-blue-300 shadow-blue-500/10 ring-1 ring-blue-500/10' : 'border-blue-100/80 shadow-blue-500/5 hover:border-blue-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                      <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">{r.name}</h4>
                      <p className="text-[11px] text-slate-400">{r.role}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ যাচাইকৃত ক্রেতা
                  </span>
                </div>

                <div className="flex text-amber-400 mb-2">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={15} fill="currentColor" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <p className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                {r.date}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Smooth Pagination dots */}
        <div className="flex justify-center items-center gap-2 mt-6 relative z-10">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveReviewDot(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer border-none p-0 ${
                activeReviewDot === idx ? 'w-6 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── 6. Two-Column FAQ Grid ── */}
      <section id="faq" className="max-w-[1360px] mx-auto px-4 sm:px-6 mb-14 scroll-mt-24 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="bg-blue-100/70 text-blue-700 text-xs font-bold px-3.5 py-1 rounded-full inline-block mb-2">
            সাধারণ প্রশ্নোত্তর
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            সাধারণ জিজ্ঞাসা (FAQ)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            আপনার জিজ্ঞাসার দ্রুত উত্তর
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqList.map((f, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-blue-100/80 shadow-sm shadow-blue-500/5 transition-all duration-300 hover:border-blue-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer transition-colors duration-200 hover:bg-blue-50/40"
                >
                  <div className="flex items-center gap-3 font-bold text-xs sm:text-sm text-slate-800">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs">
                      {i % 4 === 0 ? <Truck size={14} /> : i % 4 === 1 ? <RotateCcw size={14} /> : i % 4 === 2 ? <Shield size={14} /> : <HelpCircle size={14} />}
                    </span>
                    <span>{f.q}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. Checkout Form & Order Summary Section (Matching reference) ── */}
      <section id="order-form" className="max-w-[1360px] mx-auto px-4 sm:px-6 mb-16 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-blue-100/80 shadow-xl shadow-blue-500/5 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    এখনই অর্ডার করে নিচের ফর্মটি পূরণ করুন
                  </h3>
                </div>
                <p className="text-xs text-slate-500 pl-4">
                  সঠিকভাবে কিছু তথ্য দিন, আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">আপনার নাম *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="আপনার পুরো নাম লিখুন"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">মোবাইল নম্বর *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">সম্পূর্ণ ঠিকানা *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="গ্রাম / এলাকা, থানা, জেলা লিখুন"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                  </div>
                </div>

                {/* Delivery Area Options */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-700 block">ডেলিভারি এলাকা *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('dhaka')}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between ${
                        deliveryArea === 'dhaka'
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 scale-[1.01] shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">ঢাকার ভেতরে</span>
                        <span className="text-[11px] text-slate-500">
                          {deliveryFeeDhaka === 0 ? 'ফ্রি ডেলিভারি' : `৳${toBanglaNum(deliveryFeeDhaka)}`}
                        </span>
                      </div>
                      {deliveryArea === 'dhaka' && <Check size={16} className="text-blue-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryArea('outside')}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between ${
                        deliveryArea === 'outside'
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 scale-[1.01] shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">ঢাকার বাইরে</span>
                        <span className="text-[11px] text-slate-500">৳{toBanglaNum(deliveryFeeOutside)}</span>
                      </div>
                      {deliveryArea === 'outside' && <Check size={16} className="text-blue-600" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-base py-4 rounded-xl shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/35 active:scale-[0.98] cursor-pointer border-none flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}</span>
                  </button>
                </div>

                {/* Success alert message */}
                {orderSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</h4>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        অর্ডার নম্বর: {placedOrderId || 'ORD-983210'}। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-center text-slate-400 font-medium flex items-center justify-center gap-1.5">
                  <Lock size={12} className="text-emerald-500" />
                  <span>আপনার তথ্য সম্পূর্ণ নিরাপদ এবং গোপন রাখা হবে।</span>
                </p>
              </form>
            </div>

            {/* Right Column: Order Summary Card (Matching reference exactly) */}
            <div className="lg:col-span-5">
              <div className="bg-[#f8faff] rounded-2xl border border-blue-100/90 p-5 sm:p-6 space-y-5">
                <h4 className="text-sm font-black text-slate-900 border-b border-slate-200/80 pb-3">
                  আপনার অর্ডারের সারসংক্ষেপ
                </h4>

                {/* Product mini card */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/70">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                    <Image
                      src={galleryImages[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {product.name}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      স্টোরেজ: {selectedSize}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      রং: {selectedColor}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs border-b border-slate-200/80 pb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>মূল্য ({toBanglaNum(quantity)}টি)</span>
                    <span className="font-bold text-slate-800">
                      ৳{toBanglaNum(Math.round(product.price * quantity))}
                    </span>
                  </div>

                  {product.discount ? (
                    <div className="flex justify-between text-rose-600">
                      <span>বিশেষ ছাড় (-{toBanglaNum(product.discount)}%)</span>
                      <span className="font-bold">
                        -৳{toBanglaNum(Math.round((product.price - discountedPrice) * quantity))}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex justify-between text-slate-600">
                    <span>ডেলিভারি চার্জ</span>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {deliveryFee === 0 ? 'ফ্রি' : `৳${toBanglaNum(deliveryFee)}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between">
                  <span className="font-extrabold text-sm text-slate-900">মোট পরিশোধযোগ্য</span>
                  <span className="font-black text-2xl text-blue-600">
                    ৳{toBanglaNum(Math.round(discountedPrice * quantity) + deliveryFee)}
                  </span>
                </div>

                {/* Trust Seals strip */}
                <div className="pt-2 grid grid-cols-4 gap-2 border-t border-slate-200/80">
                  <div className="text-center">
                    <span className="text-[18px] block">🔒</span>
                    <span className="text-[9px] font-extrabold text-slate-600 block leading-tight">SSL Secured</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[18px] block">🛡️</span>
                    <span className="text-[9px] font-extrabold text-slate-600 block leading-tight">Norton Secure</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[18px] block">✅</span>
                    <span className="text-[9px] font-extrabold text-slate-600 block leading-tight">Trusted Seller</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[18px] block">💯</span>
                    <span className="text-[9px] font-extrabold text-slate-600 block leading-tight">100% Genuine</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. Footer (Dark Navy with Wave Crest matching reference) ── */}
      <footer className="relative mt-20 text-white">
        
        {/* Organic Wave Transition into Navy Footer */}
        <div className="w-full overflow-hidden leading-none select-none">
          <svg
            className="w-full h-12 sm:h-20 text-[#0b162a]"
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,32 C360,75 720,5 1080,45 C1260,65 1380,50 1440,35 L1440,80 L0,80 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="bg-[#0b162a] pt-6 pb-12 px-4 sm:px-8 border-t border-slate-800">
          <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <span className="font-extrabold text-base text-white block leading-tight">
                    {product.storeName || 'পণ্যবাজার'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {product.storeTagline || 'বিশ্বস্ত ডিজিটাল পণ্য বাজার'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                উন্নত মানের প্রডাক্ট, দ্রুত হোম এবং নির্ভরযোগ্য ডেলিভারি পেতে আজই অর্ডার করুন।
              </p>
              <div className="flex gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center cursor-pointer transition text-xs">
                  f
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition text-xs">
                  ▶
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center cursor-pointer transition text-xs">
                  📷
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-800 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer transition text-xs">
                  in
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h5 className="font-black text-sm text-white">কুইক লিংক</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => scrollToSection('product-details')} className="hover:text-white transition">› পণ্যের বিবরণ</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition">› ভিডিও</button></li>
                <li><button onClick={() => scrollToSection('reviews')} className="hover:text-white transition">› FAQ</button></li>
                <li><button onClick={() => scrollToSection('order-form')} className="hover:text-white transition">› অর্ডার করুন</button></li>
                <li><button onClick={() => scrollToSection('order-form')} className="hover:text-white transition">› যোগাযোগ</button></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h5 className="font-black text-sm text-white">সাপোর্ট</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-white transition cursor-pointer">› আমাদের সম্পর্কে</li>
                <li className="hover:text-white transition cursor-pointer">› গোপনীয়তা নীতি</li>
                <li className="hover:text-white transition cursor-pointer">› রিটার্ন পলিসি</li>
                <li className="hover:text-white transition cursor-pointer">› শর্তাবলী</li>
                <li className="hover:text-white transition cursor-pointer">› সাপোর্ট সেন্টার</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h5 className="font-black text-sm text-white">যোগাযোগ</h5>
              <div className="space-y-2 text-xs text-slate-400">
                <p className="flex items-center gap-2">
                  <Phone size={13} className="text-blue-500" />
                  <span>+880 1234-567890</span>
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle size={13} className="text-emerald-500" />
                  <span>support@ponnobazar.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={13} className="text-rose-500" />
                  <span>রাজশাহী, বাংলাদেশ</span>
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Bar with payment logos matching reference */}
          <div className="max-w-[1360px] mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© ২০২৬ পণ্যবাজার, সর্বস্বত্ব সংরক্ষিত।</p>
            
            {/* Payment method logos matching reference footer */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#e2136e] text-white px-2.5 py-0.5 rounded text-[10px] font-black tracking-tight">bKash</span>
              <span className="bg-[#f7941d] text-white px-2.5 py-0.5 rounded text-[10px] font-black tracking-tight">Nagad</span>
              <span className="bg-[#1a1f71] text-white px-2.5 py-0.5 rounded text-[10px] font-black tracking-tight">VISA</span>
              <span className="bg-[#eb001b] text-white px-2.5 py-0.5 rounded text-[10px] font-black tracking-tight">Mastercard</span>
              <span className="bg-[#0070d1] text-white px-2.5 py-0.5 rounded text-[10px] font-black tracking-tight">AMEX</span>
            </div>
          </div>
        </div>

      </footer>

      {/* ── 9. Sticky Mobile Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black text-slate-900 block">
            ৳{toBanglaNum(Math.round(discountedPrice))}
          </span>
          <span className="text-[10px] text-slate-500">ক্যাশ অন ডেলিভারি</span>
        </div>
        <button
          type="button"
          onClick={() => scrollToSection('order-form')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer border-none flex items-center gap-1.5"
        >
          <ShoppingCart size={14} />
          <span>অর্ডার করুন</span>
        </button>
      </div>

    </div>
  );
}
