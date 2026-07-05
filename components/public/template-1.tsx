'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import {
  ShoppingCart,
  Star,
  Truck,
  Shield,
  CheckCircle2,
  Phone,
  MessageCircle,
  Award,
  Play,
  RotateCcw,
  Upload,
  Home,
  Users,
  Edit,
  Mail,
  MapPin,
  ShoppingBag,
  HelpCircle,
  Plus,
  Shirt,
  MessageSquare,
  } from 'lucide-react';

interface Template1Props {
  product: Product;
}

export default function Template1({ product }: Template1Props) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);

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
      approved: false // default pending moderation
    };
    localStorage.setItem('reviews', JSON.stringify([newReview, ...currentReviews]));

    setReviewSubmitted(true);
    setReviewText('');
    setReviewName('');
    setReviewCity('');
    setTimeout(() => setReviewSubmitted(false), 5000);
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
      'গোলাпи': '#ec4899',
      'কমলা': '#f97316',
      'বেগুনি': '#a855f7',
      'মেরুন': '#7f1d1d',
      'নেভি': '#1e3a8a',
      'নেভি ব্লু': '#1e3a8a',
      'অফ হোয়াইট': '#fafaf9',
      'অফ-হোয়াইট': '#fafaf9',
      'ক্রিম': '#fdf6e2',
      'অলিভ': '#808000',
      'ম্যাজেন্টা': '#ff00ff',
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
  
  const sanitizeName = (name: string) => {
    return name ? name.replace(/\s*\(কোড:\s*.*?\)/g, '').replace(/N660/gi, '').trim() : '';
  };
  
  const activeColorIndex = selectedColorIndex !== -1 ? selectedColorIndex : 0;

  useEffect(() => {
    const idx = colorsList.indexOf(selectedColor);
    if (idx !== -1 && idx < galleryImages.length) {
      setCurrentImage(idx);
    }
  }, [selectedColor, colorsList, galleryImages.length]);

  const featuresList = product.features && product.features.length > 0
    ? product.features
    : [
      'প্রিমিয়াম মানসম্পন্ন ডিজাইন',
      'উন্নত ও টেকসই উপাদান',
      'আরামদায়ক ও আকর্ষণীয় লুক',
      'শতভাগ কোয়ালিটি গ্যারান্টি',
      'নিখুঁত ফিনিশিং ও স্থায়িত্ব',
    ];

  const textReviews = storeReviews.length > 0
    ? storeReviews.filter(r => r.approved)
    : [
      {
        name: 'রাকিবুল ইসলাম',
        city: 'ঢাকা',
        comment: 'প্রোডাক্টের মান অনেক ভালো লেগেছে। একদম ছবির মতোই পেয়েছি। ডেলিভারি বেশ দ্রুত ছিল, ধন্যবাদ!',
        date: '২ দিন আগে',
      },
      {
        name: 'সাজাদ হোসেন',
        city: 'চট্টগ্রাম',
        comment: 'প্রিমিয়াম কোয়ালিটি প্রোডাক্ট। প্যাকেজিং অনেক সুন্দর ছিল এবং ফিনিশিং অসাধারণ লেগেছে।',
        date: '৩ দিন আগে',
      },
      {
        name: 'জাসমিন আহমেদ',
        city: 'রাজশাহী',
        comment: 'খুব আরামদায়ক এবং স্টাইলিশ পাঞ্জাবি। ইদের জন্য নিয়েছিলাম, খুব ভালো লেগেছে।',
        date: '৪ দিন আগে',
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
        q: 'প্রোডাক্টের কোয়ালিটি কেমন হবে?',
        a: 'আমরা শতভাগ প্রিমিয়াম কোয়ালিটি নিশ্চিত করি। প্রতিটি প্রোডাক্ট ডেলিভারির আগে ভালো করে পরীক্ষা করে পাঠানো হয়।'
      },
      {
        q: 'ডেলিভারি চার্জ কত এবং কতদিনে পাবো?',
        a: 'ঢাকার ভেতরে ডেলিভারি চার্জ ৬০ টাকা এবং ঢাকার বাইরে ৮০ টাকা। ঢাকার ভেতরে আমরা ২৪-৪৮ ঘণ্টায় এবং ঢাকার বাইরে ২-৩ দিনের মধ্যে ডেলিভারি দিয়ে থাকি।'
      },
      {
        q: 'সাইজ বা প্রোডাক্টে সমস্যা হলে কি রিটার্ন করা যাবে?',
        a: 'জি অবশ্যই! ডেলিভারি ম্যানের সামনে প্রোডাক্টটি চেক করে দেখতে পারেন। কোনো সমস্যা থাকলে ডেলিভারি ম্যানের কাছেই সাথে সাথে এক্সচেঞ্জ বা রিটার্ন করে দিতে পারবেন।'
      },
      {
        q: 'অর্ডার করতে কোনো অগ্রিম পেমেন্ট করতে হবে?',
        a: 'জি না, আমরা ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা দিয়ে থাকি। প্রোডাক্ট হাতে পেয়ে চেক করে তারপর মূল্য পরিশোধ করবেন।'
      }
    ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      setFormData({ name: '', phone: '', address: '' });
      setReviewText('');
      setTimeout(() => setOrderSuccess(false), 8000);
    }, 2000);
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
      key="template1"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {/* 1. Header Navigation */}
      <header className="bg-[#1a365d]/90 backdrop-blur-md text-white sticky top-0 z-45 shadow-md border-b border-white/5">
        <div className="max-w-[1250px] mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1a365d] font-bold text-xl select-none">
              {(product.storeName || 'আমার স্টোর')[0]}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">{product.storeName || 'আমার স্টোর'}</h1>
              <p className="text-[10px] text-blue-200 font-bold block mt-0.5 leading-none">{product.storeTagline || 'সেরা অনলাইন শপিং অভিজ্ঞতা'}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-black text-blue-100">
            <Link href="/" className="flex items-center gap-1.5 hover:text-white transition">
              <Home size={14} className="text-blue-200 flex-shrink-0" /> হোম
            </Link>
            <Link href="/" className="flex items-center gap-1.5 hover:text-white transition">
              <Users size={14} className="text-blue-200 flex-shrink-0" /> আমাদের সম্পর্কে
            </Link>
            <Link href="/" className="flex items-center gap-1.5 hover:text-white transition">
              <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" /> কাস্টমার রিভিউ
            </Link>
          </nav>

          <div className="bg-white text-[#1a365d] pl-3.5 pr-5 py-1.5 rounded-full flex items-center gap-2.5 shadow-md hover:bg-gray-50 transition cursor-pointer">
            <Phone size={16} className="text-[#1a365d] animate-bounce flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block leading-none">অর্ডার করতে কল করুন</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight block mt-0.5 leading-none">{product.storePhone || '০১৭১২-৩৪৫৬৭৮'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Product Section */}
      <main className="max-w-[1250px] mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left: Image Gallery */}
          <div className="space-y-4 max-w-[500px] mx-auto w-full">
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden group border border-slate-200/80 shadow-md">
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md z-10">
                নতুন ডিজাইন
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={galleryImages[currentImage]}
                    alt={sanitizeName(product.name)}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              {/* Carousel Arrows */}
              <button
                onClick={() => {
                  setCurrentImage((prev) => {
                    const nextIdx = prev > 0 ? prev - 1 : galleryImages.length - 1;
                    if (colorsList[nextIdx]) {
                      setSelectedColor(colorsList[nextIdx]);
                    }
                    return nextIdx;
                  });
                }}
                type="button"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition cursor-pointer"
              >
                ❮
              </button>
              <button
                onClick={() => {
                  setCurrentImage((prev) => {
                    const nextIdx = prev < galleryImages.length - 1 ? prev + 1 : 0;
                    if (colorsList[nextIdx]) {
                      setSelectedColor(colorsList[nextIdx]);
                    }
                    return nextIdx;
                  });
                }}
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition cursor-pointer"
              >
                ❯
              </button>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentImage(i);
                    if (colorsList[i]) {
                      setSelectedColor(colorsList[i]);
                    }
                  }}
                  type="button"
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${currentImage === i
                    ? 'border-blue-600 scale-105 shadow-sm'
                    : 'border-transparent hover:border-blue-300 bg-slate-50'
                    }`}
                >
                  <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col justify-center">
            <span className="text-blue-600 text-xs font-bold border border-blue-200 bg-blue-50 px-3 py-1 rounded-lg w-max mb-4">
              এক্সক্লুসিভ কালেকশন
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 leading-tight">
              {product.heroTitle ? sanitizeName(product.heroTitle) : sanitizeName(product.name)}
              {product.heroSubtitle && (
                <>
                  <br />
                  <span className="text-blue-700 text-sm font-bold block mt-1">
                    {product.heroSubtitle}
                  </span>
                </>
              )}
            </h2>
            <p className="text-gray-655 text-xs sm:text-sm mb-6 leading-relaxed">
              {product.description || 'উন্নতমানের প্রোডাক্ট, আকর্ষণীয় ডিজাইন এবং সেরা কোয়ালিটি— যা আপনাকে দেবে শতভাগ সন্তুষ্টির গ্যারান্টি।'}
            </p>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-black text-blue-700">৳{toBanglaNum(Math.round(discountedPrice * 110))}</span>
              <span className="text-sm text-gray-400 line-through mb-1">৳{toBanglaNum(Math.round(product.price * 110))}</span>
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg mb-2">
                {toBanglaNum(product.discount)}% ছাড়
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-gray-700 mb-8 border-y border-slate-100 py-3">
              {(product.heroBadges && product.heroBadges.length > 0
                ? product.heroBadges.slice(0, 4)
                : ['প্রিমিয়াম কোয়ালিটি', 'শতভাগ অরিজিনাল', 'দ্রুত ডেলিভারি', 'সহজ রিটার্ন']
              ).map((badge: string, idx: number) => {
                const icons = [Award, Shirt, RotateCcw, RotateCcw]; // Replaced Droplet with RotateCcw for simplicity
                const IconComponent = icons[idx % icons.length];
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 text-center">
                    <IconComponent size={20} className="text-blue-600 mb-1" />
                    {badge}
                  </div>
                );
              })}
            </div>

            {/* Size & Color Selection */}
            {product.showSizes !== false && sizesList.length > 0 && (
              <div className="mb-6">
                <p className="font-bold text-gray-800 mb-3 text-sm">সাইজ</p>
                <div className="flex gap-3">
                  {sizesList.map((size: string) => {
                    const isOutOfStock = outOfStockList.includes(size.trim().toUpperCase());
                    return (
                      <div key={size} className="flex flex-col items-center gap-1">
                        <button
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSize(size)}
                          type="button"
                          className={`w-11 h-11 rounded-lg border text-xs font-bold transition ${isOutOfStock
                            ? 'border-rose-200 text-rose-400 bg-rose-50/50 cursor-not-allowed opacity-75'
                            : selectedSize === size
                              ? 'border-blue-600 bg-blue-50 text-blue-600 font-extrabold shadow-sm cursor-pointer'
                              : 'border-slate-200 hover:border-slate-350 text-slate-655 bg-white cursor-pointer'
                            }`}
                        >
                          {size}
                        </button>
                        {isOutOfStock && (
                          <span className="text-[8px] font-extrabold text-rose-600 uppercase tracking-tight select-none">
                            স্টক আউট
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {product.showColors !== false && colorsList.length > 0 && (
              <div className="mb-8">
                <p className="font-bold text-gray-800 mb-3 text-sm">রং: {selectedColor}</p>
                <div className="flex flex-wrap gap-3">
                  {colorsList.map((colorName: string, idx: number) => {
                    const hex = getColorHex(colorName);
                    const isWhiteOrLight = hex === '#ffffff' || hex === '#fafaf9' || hex === 'white';
                    return (
                      <button
                        key={colorName}
                        onClick={() => {
                          setSelectedColor(colorName);
                          if (idx < galleryImages.length) {
                            setCurrentImage(idx);
                          }
                        }}
                        type="button"
                        title={colorName}
                        style={{ backgroundColor: hex.startsWith('#') || hex.startsWith('rgb') || /^[a-zA-Z]+$/.test(hex) ? hex : undefined }}
                        className={`w-8 h-8 rounded-full border-2 relative transition-all cursor-pointer ${isWhiteOrLight ? 'border-slate-300' : 'border-transparent'
                          } ${!hex.startsWith('#') && !hex.startsWith('rgb') && !/^[a-zA-Z]+$/.test(hex) ? 'bg-slate-400' : ''
                          } ${selectedColor === colorName
                            ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 shadow-sm'
                            : 'hover:scale-105'
                          } flex items-center justify-center`}
                      >
                        {(!hex.startsWith('#') && !hex.startsWith('rgb') && !/^[a-zA-Z]+$/.test(hex)) && (
                          <span className="text-[9px] text-white font-extrabold select-none leading-none">
                            {colorName.trim()[0]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={scrollToOrder}
                type="button"
                className="flex-1 bg-blue-700 text-white py-3.5 rounded-lg font-bold hover:bg-blue-800 transition-all duration-250 flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer border-none"
              >
                <ShoppingCart className="w-5 h-5 flex-shrink-0" /> অর্ডার করুন
              </button>
              <button
                onClick={scrollToVideo}
                type="button"
                className="flex-1 border-2 border-gray-200 text-gray-700 py-3.5 rounded-lg font-bold hover:border-blue-600 hover:text-blue-600 transition-all duration-250 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] cursor-pointer"
              >
                ▶ ভিডিও দেখুন
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Trust Badges Section */}
      <section className="max-w-[1250px] mx-auto px-4 mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <Truck className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div><p className="font-bold text-sm text-gray-800">সারা বাংলাদেশ ডেলিভারি</p><p className="text-xs text-gray-500">১-৩ দিনের মধ্যে</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div><p className="font-bold text-sm text-gray-800">পেমেন্ট সিকিউরিটি</p><p className="text-xs text-gray-500">সুরক্ষিত পেমেন্ট গ্যারান্টি</p></div>
          </div>
          <div className="flex items-center gap-4">
            <RotateCcw className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div><p className="font-bold text-sm text-gray-800">৭ দিনের রিটার্ন</p><p className="text-xs text-gray-500">যেকোনো সমস্যা সমাধান</p></div>
          </div>
          <div className="flex items-center gap-4">
            <MessageCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div><p className="font-bold text-sm text-gray-800">২৪/৭ সাপোর্ট</p><p className="text-xs text-gray-500">যেকোনো সময় আমাদের সাথে</p></div>
          </div>
        </div>
      </section>

      {/* Template 1 Video & Bullet Points */}
      {(product.showVideo !== false || product.showFeatures !== false) && (
        <section id="product-video" className="max-w-[1250px] mx-auto px-4 mb-12 scroll-mt-24">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left Column: Video */}
              {product.showVideo !== false && product.videoUrl ? (
                <div>
                  <h3 className="text-xl font-bold text-[#1a365d] mb-6 flex items-center gap-2">
                    <Play size={20} className="text-blue-600" /> প্রোডাক্ট ভিডিও দেখুন
                  </h3>
                  {playVideo ? (
                    <iframe
                      src={product.videoUrl}
                      className="w-full aspect-video rounded-xl shadow-lg border border-slate-200/50"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <div
                      onClick={() => setPlayVideo(true)}
                      className="aspect-video bg-slate-900 rounded-xl relative flex items-center justify-center shadow-lg overflow-hidden border border-slate-200/50 group cursor-pointer"
                    >
                      <Image
                        src={galleryImages[2] || galleryImages[0]}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                        alt="Video cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <Play size={24} className="text-[#1a365d] fill-[#1a365d] ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:block" />
              )}

              {/* Right Column: Features and Stats */}
              {product.showFeatures !== false ? (
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-[#1a365d] mb-6">কেন আমাদের {sanitizeName(product.name) || "প্রোডাক্টটি"} সেরা?</h3>
                  <ul className="space-y-3 text-gray-700 font-medium">
                    {featuresList.map((text: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 bg-blue-50/50 border border-blue-100/60 px-4 py-3 rounded-lg">
                        <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        {text}
                      </li>
                    ))}
                  </ul>

                  {/* Customer Stats Box */}
                  {product.customerStatsTitle && (
                    <div className="mt-8 bg-[#1a365d] text-white p-5 rounded-xl flex items-center gap-4 shadow-md">
                      <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">{product.customerStatsTitle}</p>
                        <p className="text-sm text-blue-200">{product.customerStatsDesc}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:block" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. Customer Reviews Section */}
      <section className="max-w-[1250px] mx-auto px-4 mb-12">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">আমাদের কাস্টমারদের রিভিউ</h3>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setReviewType('text')}
              type="button"
              className={`px-8 py-2 rounded-md font-bold text-sm flex items-center gap-2 cursor-pointer transition-all duration-250 ${reviewType === 'text'
                ? 'bg-white border border-blue-600 text-blue-700 shadow-sm'
                : 'text-gray-650 hover:bg-gray-50'
                }`}
            >
              <MessageSquareIcon className="w-4 h-4 flex-shrink-0" /> টেক্সট রিভিউ দেখুন
            </button>
            <button
              onClick={() => setReviewType('photo')}
              type="button"
              className={`px-8 py-2 rounded-md font-bold text-sm flex items-center gap-2 cursor-pointer transition-all duration-250 ${reviewType === 'photo'
                ? 'bg-white border border-blue-600 text-blue-700 shadow-sm'
                : 'text-gray-655 hover:bg-gray-50'
                }`}
            >
              <ImageIcon className="w-4 h-4 flex-shrink-0" /> ছবি রিভিউ দেখুন
            </button>
          </div>
        </div>

        {/* Text Reviews Carousel (Simulated) */}
        <AnimatePresence mode="wait">
          {reviewType === 'text' ? (
            <motion.div
              key="text-reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative"
            >
              {textReviews.slice(0, 3).map((review, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 overflow-hidden relative">
                      {review.avatar ? (
                        <Image src={review.avatar} fill className="object-cover rounded-full" alt={review.name} />
                      ) : (
                        review.name[0]
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{review.name}</h4>
                      <p className="text-xs text-gray-500">{review.city || review.loc || 'ঢাকা'}</p>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-xs mb-3">
                    {'★'.repeat(review.rating || 5)}{'☆'.repeat(5 - (review.rating || 5))}
                  </div>
                  <p className="text-sm text-gray-655 leading-relaxed mb-4 italic">&ldquo;{review.comment || review.text}&rdquo;</p>
                  <span className="text-[10px] text-gray-400">{review.date || '২ দিন আগে'}</span>
                </div>
              ))}
            </motion.div>
          ) : (
            /* Image Reviews Carousel (Simulated WhatsApp Cards) */
            <motion.div
              key="photo-reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 relative"
            >
              {[
                { name: 'আরিফ রহমান', message: 'ভাই প্রোডাক্ট হাতে পেয়েছি, অনেক সুন্দর ❤️', img: photoReviews[0] },
                { name: 'মাহবুব আলম', message: 'কোয়ালিটি একদম অসাধারণ লেগেছে ভাইয়া! 👍', img: photoReviews[1] },
                { name: 'ইশতিয়াক আহমেদ', message: 'ব্যবহার করতে খুব আরামদায়ক ও নিখুঁত ফিনিশিং।', img: photoReviews[2] },
                { name: 'সায়েম চৌধুরী', message: 'অর্ডার করার ৩ দিনের মধ্যেই ডেলিভারি পেয়ে গেলাম। ধন্যবাদ।', img: photoReviews[3] },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg shadow-xs border border-gray-100 hover:shadow-md transition duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#1a365d] rounded-full flex items-center justify-center text-[10px] text-white font-bold select-none">
                      {item.name[0]}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{item.name}</span>
                  </div>
                  <div className="aspect-[3/4] bg-[#efeae2] rounded-lg flex flex-col p-2 border border-[#e1dbd2]">
                    <div className="flex-1 rounded overflow-hidden relative mb-2 shadow-xs bg-slate-100">
                      <Image src={item.img} fill className="object-cover" alt={`WhatsApp Review ${idx}`} />
                    </div>
                    <div className="bg-[#d9fdd3] p-2 rounded-lg text-[10px] text-gray-800 w-[95%] shadow-xs self-start leading-relaxed relative after:content-[''] after:absolute after:top-0 after:-left-1.5 after:border-[6px] after:border-transparent after:border-t-[#d9fdd3] after:border-r-[#d9fdd3]">
                      {item.message}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FAQ Accordion & CTA Banner Section for Template 1 */}
      <section className="max-w-[1250px] mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: FAQ Accordion */}
          <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-[#1a365d] mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1a365d] flex-shrink-0" /> FAQ সেকশন
              </h3>
              <div className="space-y-3.5">
                {faqList.map((item: { q: string; a: string }, idx: number) => (
                  <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full flex justify-between items-center py-3.5 px-4 text-right text-xs sm:text-sm font-bold text-slate-800 bg-[#f8fafc]/60 hover:bg-[#f1f5f9] transition-colors duration-200"
                    >
                      <span className="flex-1 text-left">{item.q}</span>
                      <Plus size={16} className="ml-4 text-slate-400 transition-transform duration-200 flex-shrink-0" style={{ transform: activeFaq === idx ? 'rotate(45deg)' : 'rotate(0deg)' }} />
                    </button>
                    <AnimatePresence initial={false}>
                      {activeFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-2 text-xs sm:text-sm text-slate-550 border-t border-slate-50 bg-[#f8fafc]/30 leading-relaxed">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: CTA Banner */}
          <div className="lg:col-span-7 bg-[#1a365d] rounded-2xl relative overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[340px]">
            {/* Text Content */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center text-white z-10">
              <span className="text-xs sm:text-sm text-blue-200 font-bold tracking-wider mb-2 block uppercase">
                সেরা কোয়ালিটি ও পারফেক্ট সার্ভিস
              </span>
              <h2 className="text-2xl sm:text-4xl font-black mb-3 tracking-tight">
                এখনই অর্ডার করুন
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mb-6 font-medium">
                সীমিত সময়ের অফার, দেরি করবেন না!
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-xs text-blue-200 font-bold mb-8">
                <span className="flex items-center gap-1.5 bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-800/30"><Truck className="w-3.5 h-3.5" /> ফ্রি ডেলিভারি</span>
                <span className="flex items-center gap-1.5 bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-800/30"><RotateCcw className="w-3.5 h-3.5" /> ৭ দিনের রিটার্ন গ্যারান্টি</span>
                <span className="flex items-center gap-1.5 bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-800/30"><Phone className="w-3.5 h-3.5" /> ২৪/৭ সাপোর্ট</span>
              </div>

              {/* Action Button */}
              <a
                href="#order-form"
                className="inline-flex items-center justify-center bg-white text-[#1a365d] font-extrabold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-50 transition duration-250 shadow-sm hover:shadow-md cursor-pointer self-start border-none"
              >
                <ShoppingBag className="w-5 h-5 flex-shrink-0" /> এখনই অর্ডার করুন
              </a>
            </div>

            {/* Model Image Layer */}
            <div className="w-full md:w-[40%] relative min-h-[240px] md:min-h-full flex-shrink-0 bg-slate-800">
              {/* Left Side Shadow Blend for Desktop */}
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#1a365d] to-transparent z-10 hidden md:block" />
              <Image
                src={galleryImages[activeColorIndex] || galleryImages[0]}
                fill
                className="object-cover object-top"
                alt="Premium Product Model"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Order Form Section */}
      
      {/* 4.5 Call and WhatsApp Section */}
      <section className="max-w-[1250px] mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">প্রয়োজনে সরাসরি যোগাযোগ করুন</h3>
            <p className="text-xs sm:text-sm text-slate-550">অর্ডার করতে কোনো সমস্যা হলে বা যেকোনো তথ্যের জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করুন।</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            {product.storePhone && (
              <a
                href={`tel:${product.storePhone}`}
                className="flex items-center justify-center gap-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl transition duration-250 hover:shadow-lg active:scale-98 cursor-pointer w-full sm:w-auto text-center border-none"
              >
                <Phone className="w-5 h-5 flex-shrink-0 animate-bounce" /> সরাসরি ফোন করুন
              </a>
            )}
            {rawWaNumber && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#20ba56] text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl transition duration-250 hover:shadow-lg active:scale-98 cursor-pointer w-full sm:w-auto text-center border-none"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.978 14.057.955 11.43.955c-5.448 0-9.876 4.372-9.88 9.802-.002 1.73.456 3.42 1.32 4.947L1.93 21.17l5.44-1.416zM15.753 13.06c-.234-.117-1.38-.68-1.597-.76-.217-.08-.375-.12-.533.12-.158.24-.612.76-.75.918-.139.158-.277.177-.51.06-.233-.118-.987-.363-1.879-1.158-.694-.62-1.162-1.385-1.298-1.62-.136-.234-.015-.36.103-.476.105-.104.233-.272.35-.408.117-.136.156-.227.234-.379.078-.152.039-.285-.019-.402-.059-.117-.533-1.285-.73-1.76-.192-.464-.388-.4-.533-.408-.138-.007-.297-.008-.456-.008-.158 0-.416.06-.634.298-.218.238-.83.812-.83 1.982 0 1.17.85 2.298.969 2.457.118.158 1.67 2.547 4.047 3.57.566.244.1008.39 1.39.497.38.032.74.015 1.012-.03.303-.049.932-.38 1.062-.747.13-.368.13-.683.09-.747-.038-.063-.156-.101-.39-.219z" />
                </svg>
                হোয়াটসঅ্যাপ করুন
              </a>
            )}
          </div>
        </div>
      </section>

      <section id="order-form" className="max-w-[1250px] mx-auto px-4 py-8 mb-12 scroll-mt-6">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-blue-800 mb-6 text-center">অর্ডার করতে নিচের ফর্মটি পূরণ করুন</h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">আপনার নাম <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm transition-all duration-200 shadow-xs bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">মোবাইল নম্বর <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm transition-all duration-200 shadow-xs bg-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">ঠিকানা <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm transition-all duration-200 shadow-xs bg-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">ডেলিভারি এলাকা <span className="text-red-500">*</span></label>
                <select
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value as 'dhaka' | 'outside')}
                  className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm bg-white transition-all duration-200 shadow-xs"
                >
                  <option value="dhaka">ঢাকার ভেতরে (ডেলিভারি চার্জ: ৳{toBanglaNum(deliveryFeeDhaka)} টাকা)</option>
                  <option value="outside">ঢাকার বাইরে (ডেলিভারি চার্জ: ৳{toBanglaNum(deliveryFeeOutside)} টাকা)</option>
                </select>
                <div className="mt-2 bg-[#eff6ff] text-blue-900 border border-blue-200/60 p-3 rounded-xl text-xs font-bold leading-relaxed shadow-3xs">
                  🚚 ঢাকার ভেতরে ডেলিভারি চার্জ ৳{toBanglaNum(deliveryFeeDhaka)} এবং ঢাকার বাইরে ৳{toBanglaNum(deliveryFeeOutside)}
                </div>
              </div>
              {/* Selectors and Quantity block on a single row */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">সাইজ নির্বাচন করুন <span className="text-red-500">*</span></label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm bg-white transition-all duration-200 shadow-xs"
                  >
                    {sizesList.map((size: string) => {
                      const isOutOfStock = outOfStockList.includes(size.trim().toUpperCase());
                      return (
                        <option key={size} value={size} disabled={isOutOfStock}>
                          {size} {isOutOfStock ? '(স্টক আউট)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">কালার নির্বাচন করুন <span className="text-red-500">*</span></label>
                  <select
                    value={selectedColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setSelectedColor(newColor);
                      const idx = colorsList.indexOf(newColor);
                      if (idx !== -1 && idx < galleryImages.length) {
                        setCurrentImage(idx);
                      }
                    }}
                    className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm bg-white transition-all duration-200 shadow-xs"
                  >
                    {colorsList.map((color: string) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">পরিমাণ (Quantity) <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-11 h-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center font-bold text-lg cursor-pointer transition select-none"
                    >
                      -
                    </button>
                    <div className="flex-1 h-11 border border-slate-200 rounded-lg flex items-center justify-center font-bold text-sm bg-slate-50/50">
                      {toBanglaNum(quantity)} টি
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-11 h-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center font-bold text-lg cursor-pointer transition select-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-700 text-white font-bold text-lg py-4 rounded-lg hover:bg-blue-800 transition-all duration-250 flex justify-center items-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer border-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      প্রসেস হচ্ছে...
                    </span>
                  ) : orderSuccess ? (
                    'অর্ডার সফল হয়েছে! 🎉'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 flex-shrink-0" /> অর্ডার কনফার্ম করুন
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">অর্ডার কনফার্ম করার পর আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে</p>

                {orderSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center mt-3 shadow-sm"
                  >
                    <p className="text-blue-800 font-extrabold text-xs">
                      🎉 অভিনন্দন! আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।
                    </p>
                  </motion.div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm h-fit">
            <h4 className="text-lg font-bold text-[#1a365d] mb-6 pb-4 border-b border-gray-100">আপনার অর্ডার</h4>

            <div className="flex gap-4 items-center mb-6">
              <div className="w-16 h-20 bg-gray-100 rounded-lg border relative overflow-hidden flex-shrink-0">
                <Image src={galleryImages[activeColorIndex] || galleryImages[0]} fill className="object-cover" alt="Order Summary thumbnail" />
              </div>
              <div>
                <h5 className="font-bold text-gray-800 text-sm">{sanitizeName(product.name)}</h5>
                <p className="text-xs text-gray-500 mt-1">সাইজ: {selectedSize} <br /> রং: {selectedColor}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-655 mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between"><span>প্রাইস</span><span className="font-bold text-gray-850">৳{toBanglaNum(Math.round(discountedPrice * quantity * 110))}</span></div>
              <div className="flex justify-between"><span>ডেলিভারি চার্জ</span><span className="font-bold text-gray-855">৳{toBanglaNum(deliveryFee)}</span></div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-gray-800 text-lg">মোট পরিমান</span>
              <span className="text-2xl font-bold text-[#1a365d]">৳{toBanglaNum(Math.round(discountedPrice * quantity * 110) + deliveryFee)}</span>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#1a365d] flex-shrink-0" />
                <div><p className="font-bold text-gray-800 text-xs">১০০% অরিজিনাল প্রোডাক্ট</p><p className="text-gray-500 text-[10px]">প্রিমিয়াম কোয়ালিটি গ্যারান্টি</p></div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1a365d] flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-blue-900 text-xs">
                    ঢাকার ভেতরে ডেলিভারি চার্জ ৳{toBanglaNum(deliveryFeeDhaka)} এবং ঢাকার বাইরে ৳{toBanglaNum(deliveryFeeOutside)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Customer Review Submission Section for Template 1 */}
      <section className="max-w-[1250px] mx-auto px-4 mb-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">আপনার মূল্যবান মতামত দিন</h3>
          <p className="text-xs text-slate-500 text-center mb-6">আমাদের পাঞ্জাবি আপনার কেমন লেগেছে? ছবি ও টেক্সটের মাধ্যমে আমাদের জানান!</p>

          <form onSubmit={handleReviewSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">আপনার নাম <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="আপনার নাম লিখুন"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm transition-all duration-200 shadow-xs bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">শহর / অবস্থান</label>
              <input
                type="text"
                placeholder="যেমন: ঢাকা"
                value={reviewCity}
                onChange={(e) => setReviewCity(e.target.value)}
                className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm transition-all duration-200 shadow-xs bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">টেক্সট রিভিউ ℹ️</label>
              <textarea
                rows={2}
                maxLength={200}
                placeholder="আপনার মতামত লিখুন..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border border-slate-200/85 p-3 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-0 text-sm transition-all duration-200 shadow-xs bg-white resize-none h-[106px]"
              />
              <p className="text-right text-[10px] text-gray-400 mt-1">{reviewText.length}/200</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">ছবি রিভিউ (যদি থাকে) ℹ️</label>
              <div className="w-full border-2 border-dashed border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 transition-all duration-250 cursor-pointer h-[106px] group shadow-xs">
                <Upload size={22} className="text-slate-400 group-hover:text-[#1a365d] transition-transform duration-200 group-hover:scale-105 mb-1" />
                <p className="text-[10px] font-bold text-gray-700">এখানে ক্লিক করে ছবি আপলোড করুন</p>
                <p className="text-[8px] text-gray-455 mt-0.5">সর্বোচ্চ ৩টি ছবি (JPG, PNG)</p>
              </div>
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                className="w-full bg-[#1a365d] text-white font-bold text-base py-3.5 rounded-lg hover:bg-blue-800 transition-all duration-250 flex justify-center items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer border-none"
              >
                <Edit className="w-4 h-4 flex-shrink-0" /> রিভিউ সাবমিট করুন
              </button>

              {reviewSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-100 rounded-lg p-4 text-center mt-3 shadow-sm"
                >
                  <p className="text-green-800 font-extrabold text-xs">
                    🎉 ধন্যবাদ! আপনার মূল্যবান রিভিউটি সফলভাবে সাবমিট করা হয়েছে।
                  </p>
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#1a365d] text-white pt-12 pb-8">
        <div className="max-w-[1250px] mx-auto px-4">
          {/* Top: Brand + Contact + Social */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
            
            {/* Brand */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1a365d] font-bold text-xl select-none">
                  {(product.storeName || 'আমার স্টোর')[0]}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">{product.storeName || 'আমার স্টোর'}</h2>
                  <p className="text-[10px] text-blue-200 font-bold block mt-0.5 leading-none">{product.storeTagline || 'সেরা অনলাইন শপিং অভিজ্ঞতা'}</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-blue-200">
              {product.storePhone && (
                <span className="flex items-center gap-2">
                  <span>📞</span> {product.storePhone}
                </span>
              )}
              {product.whatsappNumber && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.978 14.057.955 11.43.955c-5.448 0-9.876 4.372-9.88 9.802-.002 1.73.456 3.42 1.32 4.947L1.93 21.17l5.44-1.416zM15.753 13.06c-.234-.117-1.38-.68-1.597-.76-.217-.08-.375-.12-.533.12-.158.24-.612.76-.75.918-.139.158-.277.177-.51.06-.233-.118-.987-.363-1.879-1.158-.694-.62-1.162-1.385-1.298-1.62-.136-.234-.015-.36.103-.476.105-.104.233-.272.35-.408.117-.136.156-.227.234-.379.078-.152.039-.285-.019-.402-.059-.117-.533-1.285-.73-1.76-.192-.464-.388-.4-.533-.408-.138-.007-.297-.008-.456-.008-.158 0-.416.06-.634.298-.218.238-.83.812-.83 1.982 0 1.17.85 2.298.969 2.457.118.158 1.67 2.547 4.047 3.57.566.244.1008.39 1.39.497.38.032.74.015 1.012-.03.303-.049.932-.38 1.062-.747.13-.368.13-.683.09-.747-.038-.063-.156-.101-.39-.219z" /></svg>
                  WhatsApp
                </a>
              )}
            </div>

            {/* Social Links */}
            {(product.facebookUrl || product.instagramUrl || product.youtubeUrl) && (
              <div className="flex gap-3">
                {product.facebookUrl && (
                  <a href={product.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 cursor-pointer transition" title="Facebook">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
                  </a>
                )}
                {product.instagramUrl && (
                  <a href={product.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 cursor-pointer transition" title="Instagram">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  </a>
                )}
                {product.youtubeUrl && (
                  <a href={product.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 cursor-pointer transition" title="YouTube">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-blue-300">
            <p>© ২০২৬ {product.storeName || 'আমার স্টোর'}. সর্বস্বত্ব সংরক্ষিত.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              type="button"
              className="mt-4 md:mt-0 flex items-center gap-2 hover:text-white transition cursor-pointer"
            >
              উপরে উঠুন ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {rawWaNumber && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-6 z-50 bg-[#25d366] hover:bg-[#20ba56] text-white p-2.5 rounded-full shadow-2xl transition duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
          title="WhatsApp-এ মেসেজ দিন"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.978 14.057.955 11.43.955c-5.448 0-9.876 4.372-9.88 9.802-.002 1.73.456 3.42 1.32 4.947L1.93 21.17l5.44-1.416zM15.753 13.06c-.234-.117-1.38-.68-1.597-.76-.217-.08-.375-.12-.533.12-.158.24-.612.76-.75.918-.139.158-.277.177-.51.06-.233-.118-.987-.363-1.879-1.158-.694-.62-1.162-1.385-1.298-1.62-.136-.234-.015-.36.103-.476.105-.104.233-.272.35-.408.117-.136.156-.227.234-.379.078-.152.039-.285-.019-.402-.059-.117-.533-1.285-.73-1.76-.192-.464-.388-.4-.533-.408-.138-.007-.297-.008-.456-.008-.158 0-.416.06-.634.298-.218.238-.83.812-.83 1.982 0 1.17.85 2.298.969 2.457.118.158 1.67 2.547 4.047 3.57.566.244.1008.39 1.39.497.38.032.74.015 1.012-.03.303-.049.932-.38 1.062-.747.13-.368.13-.683.09-.747-.038-.063-.156-.101-.39-.219z" />
          </svg>
        </a>
      )}

    </motion.div>
  );
}

// Dummy helper icon for Text reviews
function MessageSquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-message-square w-4 h-4 flex-shrink-0"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-image w-4 h-4 flex-shrink-0"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
