'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  Layers, 
  Video, 
  HelpCircle, 
  Plus, 
  Trash2, 
  ImageIcon, 
  Sparkles, 
  Info, 
  Loader2,
  Eye,
  Shirt,
  Users,
  Truck,
  MessageSquare
} from 'lucide-react';
import { useProducts } from '@/lib/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LandingPage from '@/components/public/landing-page';

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.6): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

const parsePipe = (text: string, keys: string[]): Record<string, string>[] =>
  text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const parts = line.split('|').map((x) => x.trim());
    const o: Record<string, string> = {};
    keys.forEach((k, i) => { o[k] = parts[i] || ''; });
    return o;
  }).filter((o) => o[keys[0]]);

export default function WebsiteContentPage() {
  const { products, updateProduct } = useProducts();
  const [product, setProduct] = useState<any>(null);
  const [activeTemplate, setActiveTemplate] = useState<number>(1);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    sku: '',
    stock: '',
    videoUrl: '',
    heroBadges: '',
    features: '',
    images: ['', '', '', '', ''],
    imageColors: ['', '', '', '', ''],
    sizes: 'M, L, XL, XXL',
    colors: 'সাদা, বাদামি, গাঢ় নীল, ধূসর',
    storeName: 'পাঞ্জাবি ঘর',
    storeTagline: 'প্রিমিয়াম পাঞ্জাবি কালেকশন',
    storePhone: '০১৭১২-৩৪৫৬৭৮',
    whatsappNumber: '',
    heroTitle: 'প্রিমিয়াম কোয়ালিটির পাঞ্জাবি',
    heroSubtitle: '',
    description: '',
    customerStatsTitle: '১০,০০০+ সন্তুষ্ট গ্রাহক',
    customerStatsDesc: 'আমাদের ওপর আস্থা রেখেছেন',
    deliveryDhaka: '৬০',
    deliveryOutside: '১২০',
    outOfStockSizes: 'XXL',
    showVideo: true,
    showFaqs: true,
    showReviews: true,
    showFeatures: true,
    showSizes: true,
    showColors: true,
    showBadges: true,
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: ''
  });

  const [faqs, setFaqs] = useState<Array<{ q: string; a: string }>>([]);

  // Template-3 (PureSip-style) extra content — all dashboard-editable
  const [extra, setExtra] = useState({
    specsText: 'ডাইমেনশন (আকার) | ২৫.৫ x ৭.৫ সেমি\nউপাদান | স্টেইনলেস স্টিল (BPA Free)\nওজন | ৩২০ গ্রাম\nব্যাটারি | ৭০০mAh (৭ দিন পর্যন্ত)\nকানেক্টিভিটি | স্মার্ট LED ইন্ডিকেটর\nপ্যাকেজে যা থাকছে | বোতল, USB কেবল, ম্যানুয়াল',
    reviewsText: 'রাকিব হাসান | ভেরিফায়েড বায়ার | পানি অনেকক্ষণ ঠান্ডা থাকে। ডিজাইনও প্রিমিয়াম। | 5 | \nসুমাইয়া জান্নাত | ভেরিফায়েড বায়ার | ব্যাটারি ব্যাকআপে আমি খুব সন্তুষ্ট। | 5 | \nতানভীর আহমেদ | ভেরিফায়েড বায়ার | LED ইন্ডিকেটর খুবই উপকারী। | 5 | ',
    statsText: '৬০K+ | সন্তুষ্ট গ্রাহক\n৪.৯/৫ | গড় রেটিং\n৯৮% | সন্তুষ্টি হার\n১২০+ | দেশে ব্যবহার হচ্ছে',
    navText: 'বৈশিষ্ট্য | features\nরিভিউ | reviews\nস্পেসিফিকেশন | specs\nপ্রশ্নোত্তর | faq',
    ratingAverage: '৪.৯',
    ratingCount: '১,২৪৮',
    ratingBarsText: '92,6,2,0,0',
    paymentMethodsText: 'visa,mastercard,bkash,nagad,rocket',
    offerTitle: 'সীমিত সময়ের অফার!',
    offerEndsAt: '',
    showSpecs: true,
    showStats: true,
    showOffer: true,
    showCart: true,
  });

  // Sync state with product data
  useEffect(() => {
    if (products.length > 0 && !product) {
      const activeProduct = products[0];
      setProduct(activeProduct);
      const loadedTemplate = activeProduct.templateId || 1;
      setActiveTemplate(loadedTemplate);
      setFormData({
        name: activeProduct.name || '',
        price: activeProduct.price ? String(activeProduct.price) : '',
        discount: activeProduct.discount ? String(activeProduct.discount) : '0',
        sku: activeProduct.sku || '',
        stock: activeProduct.stock ? String(activeProduct.stock) : '0',
        videoUrl: activeProduct.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        heroBadges: activeProduct.heroBadges ? activeProduct.heroBadges.join(', ') : 'সুতি ফ্যাব্রিক, আরামদায়ক ফিট, কালার গ্যারান্টি, সহজ রিটার্ন',
        features: activeProduct.features ? activeProduct.features.join('\n') : 'প্রিমিয়াম কটন ফ্যাব্রিক\nনিখুঁত এমব্রয়ডারি কাজ\nআরামদায়ক ও সফট ফিট\nরং না ওঠার গ্যারান্টি\nপারফেক্ট সেলাই ও ফিনিশিং\nঈদ, পূজা ও যেকোনো অনুষ্ঠানের জন্য উপযোগী',
        images: activeProduct.images && activeProduct.images.length > 0 ? activeProduct.images : ['', '', '', '', ''],
        imageColors: activeProduct.imageColors && activeProduct.imageColors.length > 0 ? activeProduct.imageColors : ['', '', '', '', ''],
        sizes: activeProduct.sizes ? activeProduct.sizes.join(', ') : 'M, L, XL, XXL',
        colors: activeProduct.colors ? activeProduct.colors.join(', ') : 'সাদা, বাদামি, গাঢ় নীল, ধূসর',
        storeName: activeProduct.storeName || 'পাঞ্জাবি ঘর',
        storeTagline: activeProduct.storeTagline || 'প্রিমিয়াম পাঞ্জাবি কালেকশন',
        storePhone: activeProduct.storePhone || '০১৭১২-৩৪৫৬৭৮',
        whatsappNumber: activeProduct.whatsappNumber || '',
        heroTitle: activeProduct.heroTitle || 'প্রিমিয়াম কোয়ালিটির পাঞ্জাবি',
        heroSubtitle: activeProduct.heroSubtitle || '',
        description: activeProduct.description || '',
        customerStatsTitle: activeProduct.customerStatsTitle || '১০,০০০+ সন্তুষ্ট গ্রাহক',
        customerStatsDesc: activeProduct.customerStatsDesc || 'আমাদের ওপর আস্থা রেখেছেন',
        deliveryDhaka: activeProduct.deliveryDhaka ? String(activeProduct.deliveryDhaka) : '৬০',
        deliveryOutside: activeProduct.deliveryOutside ? String(activeProduct.deliveryOutside) : '১২০',
        outOfStockSizes: activeProduct.outOfStockSizes || '',
        facebookUrl: activeProduct.facebookUrl || '',
        instagramUrl: activeProduct.instagramUrl || '',
        youtubeUrl: activeProduct.youtubeUrl || '',
        showVideo: activeProduct.showVideo !== undefined ? activeProduct.showVideo : true,
        showFaqs: activeProduct.showFaqs !== undefined ? activeProduct.showFaqs : true,
        showReviews: activeProduct.showReviews !== undefined ? activeProduct.showReviews : true,
        showFeatures: activeProduct.showFeatures !== undefined ? activeProduct.showFeatures : true,
        showSizes: activeProduct.showSizes !== undefined ? activeProduct.showSizes : true,
        showColors: activeProduct.showColors !== undefined ? activeProduct.showColors : true,
        showBadges: activeProduct.showBadges !== undefined ? activeProduct.showBadges : true
      });
      setFaqs(activeProduct.faqs && activeProduct.faqs.length > 0 ? activeProduct.faqs : [
        {
          q: 'পাঞ্জাবির কালার বা রং কি উঠে যাবে?',
          a: 'জি না, আমাদের পাঞ্জাবিগুলো প্রিমিয়াম কালার ডাইং করা সুতা দিয়ে তৈরি। আমরা ১০০% কালার ও ফেব্রিক গ্যারান্টি দিচ্ছি। সঠিক নিয়মে ধৌত করলে রং নষ্ট হবে না।'
        },
        {
          q: 'ডেলিভারি চার্জ কত এবং কতদিনে পাবো?',
          a: 'ঢাকার ভেতরে ডেলিভারি চার্জ ৬০ টাকা এবং ঢাকার বাইরে ৮০ টাকা। ঢাকার ভেতরে আমরা ২৪-৪৮ ঘণ্টায় এবং ঢাকার বাইরে ২-৩ দিনের মধ্যে ডেলিভারি দিয়ে থাকি।'
        }
      ]);
      setExtra({
        specsText: activeProduct.specs && activeProduct.specs.length > 0 ? activeProduct.specs.map((sp) => `${sp.label} | ${sp.value}`).join('\n') : 'ডাইমেনশন (আকার) | ২৫.৫ x ৭.৫ সেমি\nউপাদান | স্টেইনলেস স্টিল (BPA Free)\nওজন | ৩২০ গ্রাম\nব্যাটারি | ৭০০mAh (৭ দিন পর্যন্ত)\nকানেক্টিভিটি | স্মার্ট LED ইন্ডিকেটর\nপ্যাকেজে যা থাকছে | বোতল, USB কেবল, ম্যানুয়াল',
        reviewsText: activeProduct.productReviews && activeProduct.productReviews.length > 0 ? activeProduct.productReviews.map((r) => `${r.name} | ${r.city} | ${r.text} | ${r.rating || 5} | ${r.image || ''}`).join('\n') : 'রাকিব হাসান | ভেরিফায়েড বায়ার | পানি অনেকক্ষণ ঠান্ডা থাকে। ডিজাইনও প্রিমিয়াম। | 5 | \nসুমাইয়া জান্নাত | ভেরিফায়েড বায়ার | ব্যাটারি ব্যাকআপে আমি খুব সন্তুষ্ট। | 5 | \nতানভীর আহমেদ | ভেরিফায়েড বায়ার | LED ইন্ডিকেটর খুবই উপকারী। | 5 | ',
        statsText: activeProduct.stats && activeProduct.stats.length > 0 ? activeProduct.stats.map((st) => `${st.value} | ${st.label}`).join('\n') : '৬০K+ | সন্তুষ্ট গ্রাহক\n৪.৯/৫ | গড় রেটিং\n৯৮% | সন্তুষ্টি হার\n১২০+ | দেশে ব্যবহার হচ্ছে',
        navText: activeProduct.navLinks && activeProduct.navLinks.length > 0 ? activeProduct.navLinks.map((n) => `${n.label} | ${n.anchor}`).join('\n') : 'বৈশিষ্ট্য | features\nরিভিউ | reviews\nস্পেসিফিকেশন | specs\nপ্রশ্নোত্তর | faq',
        ratingAverage: activeProduct.ratingAverage || '৪.৯',
        ratingCount: activeProduct.ratingCount || '১,২৪৮',
        ratingBarsText: activeProduct.ratingBars && activeProduct.ratingBars.length > 0 ? activeProduct.ratingBars.join(',') : '92,6,2,0,0',
        paymentMethodsText: activeProduct.paymentMethods && activeProduct.paymentMethods.length > 0 ? activeProduct.paymentMethods.join(',') : 'visa,mastercard,bkash,nagad,rocket',
        offerTitle: activeProduct.offerTitle || 'সীমিত সময়ের অফার!',
        offerEndsAt: activeProduct.offerEndsAt || '',
        showSpecs: activeProduct.showSpecs !== undefined ? activeProduct.showSpecs : true,
        showStats: activeProduct.showStats !== undefined ? activeProduct.showStats : true,
        showOffer: activeProduct.showOffer !== undefined ? activeProduct.showOffer : true,
        showCart: activeProduct.showCart !== undefined ? activeProduct.showCart : true,
      });
    }
  }, [products, product]);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setSaveStatus('idle');
      setSaveError('আপনার ব্রাউজার লোকাল স্টোরেজ লিমিট অতিক্রম করেছে! দয়া করে ছোট আকারের ছবি ব্যবহার করুন অথবা কিছু ছবি মুছে ফেলুন।');
      setTimeout(() => setSaveError(null), 8000);
    };
    window.addEventListener('storage-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('storage-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const handleAddFaq = () => {
    setFaqs([...faqs, { q: '', a: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, idx) => idx !== index));
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', value: string) => {
    const nextFaqs = faqs.map((faq, idx) => {
      if (idx === index) {
        return { ...faq, [field]: value };
      }
      return faq;
    });
    setFaqs(nextFaqs);
  };

  const handleImageChange = (index: number, value: string) => {
    const nextImages = [...formData.images];
    nextImages[index] = value;
    setFormData({ ...formData, images: nextImages });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const compressed = await compressImage(base64String);
          setFormData((prev) => {
            const nextImages = [...prev.images];
            const nextImageColors = prev.imageColors ? [...prev.imageColors] : [];
            while (nextImageColors.length < nextImages.length) {
              nextImageColors.push('');
            }
            const emptyIndex = nextImages.findIndex((img) => !img);
            if (emptyIndex !== -1) {
              nextImages[emptyIndex] = compressed;
              nextImageColors[emptyIndex] = '';
            } else {
              nextImages.push(compressed);
              nextImageColors.push('');
            }
            return {
              ...prev,
              images: nextImages,
              imageColors: nextImageColors
            };
          });
        } catch (error) {
          console.error("Compression failed", error);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const nextImages = formData.images.filter((_, idx) => idx !== index);
    const nextImageColors = formData.imageColors ? formData.imageColors.filter((_, idx) => idx !== index) : [];
    setFormData({
      ...formData,
      images: nextImages,
      imageColors: nextImageColors
    });
  };

  const handleImageColorChange = (index: number, value: string) => {
    const nextImageColors = formData.imageColors ? [...formData.imageColors] : ['', '', '', '', ''];
    while (nextImageColors.length <= index) {
      nextImageColors.push('');
    }
    nextImageColors[index] = value;
    setFormData({
      ...formData,
      imageColors: nextImageColors
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSaveStatus('saving');
    setSaveError(null);

    // Compress any base64 images to prevent localStorage quota issues
    const compressedImages = await Promise.all(formData.images.map(async (img) => {
      if (img && img.startsWith('data:image/')) {
        try {
          return await compressImage(img);
        } catch (err) {
          console.error('Failed to compress image:', err);
          return img;
        }
      }
      return img;
    }));

    // Simulate premium saving delay
    setTimeout(() => {
      updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku,
        discount: parseFloat(formData.discount) || 0,
        videoUrl: formData.videoUrl,
        heroBadges: formData.heroBadges.split(',').map((s) => s.trim()).filter(Boolean),
        features: formData.features.split('\n').map((s) => s.trim()).filter(Boolean),
        faqs: faqs.filter((f) => f.q.trim() && f.a.trim()),
        images: compressedImages.filter(Boolean),
        imageColors: formData.imageColors,
        templateId: activeTemplate,
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((s) => s.trim()).filter(Boolean),
        storeName: formData.storeName,
        storeTagline: formData.storeTagline,
        storePhone: formData.storePhone,
        whatsappNumber: formData.whatsappNumber,
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        customerStatsTitle: formData.customerStatsTitle,
        customerStatsDesc: formData.customerStatsDesc,
        deliveryDhaka: formData.deliveryDhaka,
        deliveryOutside: formData.deliveryOutside,
        outOfStockSizes: formData.outOfStockSizes,
        showVideo: formData.showVideo,
        showFaqs: formData.showFaqs,
        showReviews: formData.showReviews,
        showFeatures: formData.showFeatures,
        showSizes: formData.showSizes,
        showColors: formData.showColors,
        showBadges: formData.showBadges,
        facebookUrl: formData.facebookUrl,
        instagramUrl: formData.instagramUrl,
        youtubeUrl: formData.youtubeUrl,
        specs: parsePipe(extra.specsText, ['label', 'value']).map((o) => ({ label: o.label, value: o.value })),
        productReviews: parsePipe(extra.reviewsText, ['name', 'city', 'text', 'rating', 'image']).map((r: Record<string, string>) => ({ name: r.name, city: r.city, text: r.text, rating: Number(r.rating) || 5, image: r.image || '' })),
        stats: parsePipe(extra.statsText, ['value', 'label']).map((o) => ({ value: o.value, label: o.label })),
        navLinks: parsePipe(extra.navText, ['label', 'anchor']).map((o) => ({ label: o.label, anchor: o.anchor })),
        ratingAverage: extra.ratingAverage,
        ratingCount: extra.ratingCount,
        ratingBars: extra.ratingBarsText.split(',').map((n) => Number(n.trim()) || 0).slice(0, 5),
        paymentMethods: extra.paymentMethodsText.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean),
        offerTitle: extra.offerTitle,
        offerEndsAt: extra.offerEndsAt,
        showSpecs: extra.showSpecs,
        showStats: extra.showStats,
        showOffer: extra.showOffer,
        showCart: extra.showCart
      });

      setFormData((prev) => ({
        ...prev,
        images: compressedImages,
        imageColors: prev.imageColors
      }));

      setSaveStatus((current) => current === 'saving' ? 'saved' : current);
      setTimeout(() => setSaveStatus((current) => current === 'saved' ? 'idle' : current), 3000);
    }, 800);
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 w-full pb-16"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <FileText className="text-primary" size={30} />
            ওয়েবসাইট কন্টেন্ট
          </h1>
          <p className="text-muted-foreground mt-2">
            আপনার স্টোরফ্রন্টের টেমপ্লেট লেআউট নির্বাচন করুন এবং ল্যান্ডিং পেজের বিবরণ কাস্টমাইজ করুন।
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className={cn(
            "h-10 px-5 font-bold rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer border select-none",
            activeTemplate === 1
              ? "bg-white text-[#1a365d] border-[#1a365d]/20 hover:bg-[#1a365d]/5"
              : "bg-white text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-50/5"
          )}
        >
          <Eye size={16} />
          লাইভ প্রিভিউ স্টোরফ্রন্ট
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Template Selectors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Layers
                className={activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"}
                size={18}
              />
              <h2>সক্রিয় স্টোরফ্রন্ট টেমপ্লেট লেআউট</h2>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              ডিজাইন নির্বাচন করতে ক্লিক করুন
            </span>
          </div>

          <div className="flex items-center gap-3 bg-muted/40 p-1.5 rounded-2xl border border-border/50 w-full sm:w-fit">
            <button
              type="button"
              onClick={() => setActiveTemplate(1)}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer border border-transparent select-none",
                activeTemplate === 1
                  ? "bg-[#1a365d] text-white shadow-lg shadow-[#1a365d]/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Sparkles size={14} />
              টেমপ্লেট ১ (ক্লাসিক শোকেস)
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplate(2)}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer border border-transparent select-none",
                activeTemplate === 2
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Layers size={14} />
              টেমপ্লেট ২ (মডার্ন ডাইনামিক লেআউট)
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplate(3)}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer border border-transparent select-none",
                activeTemplate === 3
                  ? "bg-[#c6a15b] text-[#14110f] shadow-lg shadow-[#c6a15b]/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Sparkles size={14} />
              টেমপ্লেট ৩ (লাক্সারি বুটিক)
            </button>
          </div>
        </div>

        {/* Edit Fields */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-foreground font-bold border-b border-border pb-2">
            <Sparkles
              className={cn("animate-pulse", activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600")}
              size={18}
            />
            <h2>
              সম্পাদনা করুন: {activeTemplate === 1 ? 'টেমপ্লেট ১ এর কন্টেন্ট' : activeTemplate === 2 ? 'টেমপ্লেট ২ এর কন্টেন্ট' : 'টেমপ্লেট ৩ এর কন্টেন্ট'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Brand and Header Info */}
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4">
                <h3
                  className={cn(
                    "font-bold text-sm border-b border-border/40 pb-2 flex items-center gap-2 transition-colors duration-300",
                    activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  <Sparkles size={16} /> ১. হেডার ও ব্র্যান্ডিং তথ্য
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">স্টোরের নাম</Label>
                    <Input
                      type="text"
                      placeholder="পাঞ্জাবি ঘর"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">স্টোরের স্লোগান / বিবরণ</Label>
                    <Input
                      type="text"
                      placeholder="প্রিমিয়াম পাঞ্জাবি কালেকশন"
                      value={formData.storeTagline}
                      onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">অর্ডার ফোন হটলাইন</Label>
                    <Input
                      type="text"
                      placeholder="০১৭১২-৩৪৫৬৭৮"
                      value={formData.storePhone}
                      onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">হোয়াটসঅ্যাপ নম্বর</Label>
                    <Input
                      type="text"
                      placeholder="01712345678"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-4 pt-4 border-t border-border/40">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">🔗 সোশ্যাল মিডিয়া লিংক (ফুটারে দেখাবে)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
                        Facebook URL
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://facebook.com/yourpage"
                        value={formData.facebookUrl}
                        onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                        className={cn(
                          "bg-background focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                        Instagram URL
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://instagram.com/yourpage"
                        value={formData.instagramUrl}
                        onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                        className={cn(
                          "bg-background focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                        YouTube URL
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://youtube.com/@yourchannel"
                        value={formData.youtubeUrl}
                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                        className={cn(
                          "bg-background focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Banner and Products Info */}
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4">
                <h3
                  className={cn(
                    "font-bold text-sm border-b border-border/40 pb-2 transition-colors duration-300",
                    activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  ২. হিরো ব্যানার ও সাধারণ প্রোডাক্ট তথ্য
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">হিরো হেডলাইন টাইটেল</Label>
                    <Input
                      type="text"
                      placeholder="প্রিমিয়াম কোয়ালিটির পাঞ্জাবি"
                      value={formData.heroTitle}
                      onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">হিরো সাবটাইটেল</Label>
                    <Input
                      type="text"
                      placeholder="হিরো সাবটাইটেল লিখুন"
                      value={formData.heroSubtitle}
                      onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">প্রোডাক্টের নাম (বাংলা বা ইংরেজি)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className={cn(
                        "mt-1.5 focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">প্রোডাক্টের সংক্ষিপ্ত বিবরণ (Description)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={cn(
                        "mt-1.5 focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                      rows={3}
                      placeholder="উন্নতমানের প্রোডাক্ট, আকর্ষণীয় ডিজাইন এবং সেরা কোয়ালিটি..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">নিয়মিত মূল্য (৳)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className={cn(
                          "mt-1.5 focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount">ছাড়ের শতকরা হার (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        className={cn(
                          "mt-1.5 focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">বর্তমান স্টক লেভেল (টি)</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        className={cn(
                          "mt-1.5 focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="heroBadges">হিরো হাইলাইটস (কমা দিয়ে লিখুন)</Label>
                    <Input
                      id="heroBadges"
                      type="text"
                      value={formData.heroBadges}
                      onChange={(e) => setFormData({ ...formData, heroBadges: e.target.value })}
                      placeholder="সুতি ফ্যাব্রিক, কালার গ্যারান্টি, আরামদায়ক"
                      className={cn(
                        "mt-1.5 focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                    <div className="flex items-center gap-2 mt-2 bg-muted/30 px-3 py-1 rounded-lg border border-border/25 max-w-max">
                      <input
                        type="checkbox"
                        id="showBadges"
                        checked={formData.showBadges}
                        onChange={(e) => setFormData({ ...formData, showBadges: e.target.checked })}
                        className={cn(
                          "w-3.5 h-3.5 rounded border-border text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer",
                          activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"
                        )}
                      />
                      <Label htmlFor="showBadges" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                        ট্রাস্ট ব্যাজ দেখান
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">সাইজের অপশনসমূহ (কমা দিয়ে লিখুন)</Label>
                      <Input
                        type="text"
                        placeholder="M, L, XL, XXL"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        className={cn(
                          "bg-background focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                      <div className="flex items-center gap-2 mt-1.5 bg-muted/30 px-3 py-1 rounded-lg border border-border/25 max-w-max">
                        <input
                          type="checkbox"
                          id="showSizes"
                          checked={formData.showSizes}
                          onChange={(e) => setFormData({ ...formData, showSizes: e.target.checked })}
                          className={cn(
                            "w-3.5 h-3.5 rounded border-border text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer",
                            activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"
                          )}
                        />
                        <Label htmlFor="showSizes" className="text-[10px] font-bold text-muted-foreground cursor-pointer select-none">
                          সাইজ অপশন দেখান
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">কালারের অপশনসমূহ (কমা দিয়ে লিখুন)</Label>
                      <Input
                        type="text"
                        placeholder="সাদা, বাদামি, গাঢ় নীল, ধূসর"
                        value={formData.colors}
                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                        className={cn(
                          "bg-background focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                      <div className="flex items-center gap-2 mt-1.5 bg-muted/30 px-3 py-1 rounded-lg border border-border/25 max-w-max">
                        <input
                          type="checkbox"
                          id="showColors"
                          checked={formData.showColors}
                          onChange={(e) => setFormData({ ...formData, showColors: e.target.checked })}
                          className={cn(
                            "w-3.5 h-3.5 rounded border-border text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer",
                            activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"
                          )}
                        />
                        <Label htmlFor="showColors" className="text-[10px] font-bold text-muted-foreground cursor-pointer select-none">
                          কালার অপশন দেখান
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2 bg-muted/20 p-4 rounded-xl border border-border/40 mt-1">
                      <Label className="text-xs font-bold text-foreground">সাইজ স্টক স্ট্যাটাস (ক্লিক করে স্টক-আউট করুন)</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.sizes.split(',').map((s) => s.trim()).filter(Boolean).map((size) => {
                          const parsedOutOfStock = formData.outOfStockSizes
                            ? formData.outOfStockSizes.split(',').map((x) => x.trim().toUpperCase())
                            : [];
                          const isOutOfStock = parsedOutOfStock.includes(size.toUpperCase());

                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => {
                                let nextOutOfStock = [...parsedOutOfStock];
                                if (isOutOfStock) {
                                  nextOutOfStock = nextOutOfStock.filter((x) => x !== size.toUpperCase());
                                } else {
                                  nextOutOfStock.push(size.toUpperCase());
                                }
                                setFormData({
                                  ...formData,
                                  outOfStockSizes: nextOutOfStock.join(', ')
                                });
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 border select-none",
                                isOutOfStock
                                  ? "bg-rose-500/10 text-rose-600 border-rose-300 hover:bg-rose-500/20"
                                  : "bg-emerald-500/10 text-emerald-600 border-emerald-300 hover:bg-emerald-500/20"
                              )}
                            >
                              <span className={cn("w-2 h-2 rounded-full", isOutOfStock ? "bg-rose-500" : "bg-emerald-500")} />
                              {size}
                              <span className="text-[9px] px-1 py-0.5 rounded bg-background shadow-3xs font-extrabold">
                                {isOutOfStock ? 'স্টক আউট ❌' : 'ইন স্টক  '}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        সব সাইজ ডিফল্ট হিসেবে "ইন স্টক" থাকে। সাইজ বাটনে ক্লিক করে সহজেই স্টক-আউট স্ট্যাটাস পরিবর্তন করুন।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bullet Features */}
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4">
                <h3
                  className={cn(
                    "font-bold text-sm border-b border-border/40 pb-2 flex items-center gap-2 transition-colors duration-300",
                    activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  <Shirt size={16} /> ৩. পাঞ্জাবির বিশেষ বৈশিষ্ট্যসমূহ (Features)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-lg border border-border/25 max-w-max">
                    <input
                      type="checkbox"
                      id="showFeatures"
                      checked={formData.showFeatures}
                      onChange={(e) => setFormData({ ...formData, showFeatures: e.target.checked })}
                      className={cn(
                        "w-3.5 h-3.5 rounded border-border text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer",
                        activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"
                      )}
                    />
                    <Label htmlFor="showFeatures" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                      বৈশিষ্ট্য সেকশন দেখান
                    </Label>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="features" className="text-xs font-semibold text-foreground">বৈশিষ্ট্যসমূহ (প্রতি লাইনে একটি করে লিখুন)</Label>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      rows={5}
                      placeholder="যেমন: প্রিমিয়াম কটন ফ্যাব্রিক..."
                      className={cn(
                        "mt-1.5 resize-y leading-relaxed focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Product Video Details */}
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4">
                <h3
                  className={cn(
                    "font-bold text-sm border-b border-border/40 pb-2 flex items-center gap-2 transition-colors duration-300",
                    activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  <Video size={16} /> ৪. প্রোডাক্টের ভিডিও রিভিউ (YouTube Video)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-lg border border-border/25 max-w-max">
                    <input
                      type="checkbox"
                      id="showVideo"
                      checked={formData.showVideo}
                      onChange={(e) => setFormData({ ...formData, showVideo: e.target.checked })}
                      className={cn(
                        "w-3.5 h-3.5 rounded border-border text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer",
                        activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"
                      )}
                    />
                    <Label htmlFor="showVideo" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                      ভিডিও সেকশন দেখান
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="videoUrl" className="text-xs font-semibold text-foreground">ইউটিউব প্রোডাক্ট ভিডিও এম্বেড লিংক</Label>
                    <Input
                      id="videoUrl"
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      className={cn(
                        "mt-1.5 focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      সরাসরি ইউটিউব এম্বেড লিংকটি দিন, যেমন: `https://www.youtube.com/embed/VIDEO_ID`
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Stats section */}
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4">
                <h3
                  className={cn(
                    "font-bold text-sm border-b border-border/40 pb-2 flex items-center gap-2 transition-colors duration-300",
                    activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  <Users size={16} /> ৫. কাস্টমার পরিসংখ্যান ব্যানার
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">পরিসংখ্যান ব্যানার টাইটেল</Label>
                    <Input
                      type="text"
                      placeholder="১০,০০০+ সন্তুষ্ট গ্রাহক"
                      value={formData.customerStatsTitle}
                      onChange={(e) => setFormData({ ...formData, customerStatsTitle: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">পরিসংখ্যান ব্যানার বিবরণ</Label>
                    <Input
                      type="text"
                      placeholder="আমাদের ওপর আস্থা রেখেছেন"
                      value={formData.customerStatsDesc}
                      onChange={(e) => setFormData({ ...formData, customerStatsDesc: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery charges */}
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4">
                <h3
                  className={cn(
                    "font-bold text-sm border-b border-border/40 pb-2 flex items-center gap-2 transition-colors duration-300",
                    activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  <Truck size={16} /> ৬. ডেলিভারি চার্জ সেটিং
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">ডেলিভারি চার্জ ঢাকার ভেতরে (৳)</Label>
                    <Input
                      type="text"
                      placeholder="৬০"
                      value={formData.deliveryDhaka}
                      onChange={(e) => setFormData({ ...formData, deliveryDhaka: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">ডেলিভারি চার্জ ঢাকার বাইরে (৳)</Label>
                    <Input
                      type="text"
                      placeholder="১২০"
                      value={formData.deliveryOutside}
                      onChange={(e) => setFormData({ ...formData, deliveryOutside: e.target.value })}
                      className={cn(
                        "bg-background focus-visible:border-primary",
                        activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* FAQs accordion manager */}
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4">
                <div className="flex flex-wrap gap-3 items-center justify-between border-b border-border/40 pb-2.5">
                  <h3
                    className={cn(
                      "font-bold text-sm flex items-center gap-2 transition-colors duration-300",
                      activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                    )}
                  >
                    <HelpCircle size={16} /> ৭. সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর (FAQ)
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/25">
                      <input
                        type="checkbox"
                        id="showFaqs"
                        checked={formData.showFaqs}
                        onChange={(e) => setFormData({ ...formData, showFaqs: e.target.checked })}
                        className={cn(
                          "w-3.5 h-3.5 rounded border-border text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer",
                          activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"
                        )}
                      />
                      <Label htmlFor="showFaqs" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                        FAQ সেকশন দেখান
                      </Label>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddFaq}
                      className={cn(
                        "h-7 cursor-pointer text-xs font-semibold select-none border",
                        activeTemplate === 1
                          ? "bg-[#1a365d]/10 text-[#1a365d] border-[#1a365d]/20 hover:bg-[#1a365d]/20"
                          : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                      )}
                    >
                      <Plus size={14} className="mr-1" /> প্রশ্নোত্তর যোগ করুন
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {faqs.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      এখনো কোনো প্রশ্নোত্তর যোগ করা হয়নি। প্রশ্নোত্তর যোগ করতে উপরে ক্লিক করুন।
                    </p>
                  ) : (
                    faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="space-y-2 p-4 bg-muted/30 border border-border/50 rounded-xl relative group"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="absolute right-3 top-3 p-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer border-none"
                          title="Remove FAQ"
                        >
                          <Trash2 size={13} />
                        </button>
                        <div className="pr-8 space-y-2">
                          <div>
                            <Label className="text-[10px] text-muted-foreground">
                              প্রশ্ন {index + 1}
                            </Label>
                            <Input
                              type="text"
                              value={faq.q}
                              onChange={(e) => handleFaqChange(index, 'q', e.target.value)}
                              className={cn(
                                "mt-1 w-full bg-background focus-visible:border-primary",
                                activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                              )}
                              placeholder="যেমন: কালার গ্যারান্টি আছে কি?"
                              required
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-muted-foreground">উত্তর</Label>
                            <Textarea
                              value={faq.a}
                              onChange={(e) => handleFaqChange(index, 'a', e.target.value)}
                              className={cn(
                                "mt-1 w-full bg-background resize-none min-h-[50px] focus-visible:border-primary",
                                activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                              )}
                              placeholder="যেমন: জি, আমাদের প্রোডাক্টে শতভাগ কালার গ্যারান্টি রয়েছে..."
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Customer Reviews Settings */}
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4">
                <h3
                  className={cn(
                    "font-bold text-sm border-b border-border/40 pb-2 flex items-center gap-2 transition-colors duration-300",
                    activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  <MessageSquare size={16} /> ৮. কাস্টমার রিভিউ ও ফিডব্যাক সেকশন (Reviews)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/25 max-w-max">
                    <input
                      type="checkbox"
                      id="showReviews"
                      checked={formData.showReviews}
                      onChange={(e) => setFormData({ ...formData, showReviews: e.target.checked })}
                      className={cn(
                        "w-3.5 h-3.5 rounded border-border text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer",
                        activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"
                      )}
                    />
                    <Label htmlFor="showReviews" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                      রিভিউ সেকশন দেখান
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    গ্রাহকদের দেওয়া রেটিং, লিখিত রিভিউ এবং হোয়াটসঅ্যাপ চ্যাটের স্ক্রিনশট রিভিউ সেকশনটি ল্যান্ডিং পেজে প্রদর্শন করতে বা লুকাতে এই অপশনটি ব্যবহার করুন।
                  </p>
                </div>
              </div>

              {/* Template 3 Luxury Boutique settings */}
              {activeTemplate === 3 && (
                <div className="premium-card bg-card p-6 rounded-2xl space-y-6 border border-[#c6a15b]/25 shadow-lg shadow-[#c6a15b]/5">
                  <h3 className="font-bold text-sm border-b border-border/40 pb-2 flex items-center gap-2 text-[#c6a15b] dark:text-[#c6a15b]">
                    <Sparkles size={16} /> ৯. টেমপ্লেট ৩ (লাক্সারি বুটিক) বিশেষ সেটিংস
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Show/Hide switches */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-xl border border-border/40">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showSpecs"
                          checked={extra.showSpecs}
                          onChange={(e) => setExtra({ ...extra, showSpecs: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-border text-[#c6a15b] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <Label htmlFor="showSpecs" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                          স্পেসিফিকেশন
                        </Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showStats"
                          checked={extra.showStats}
                          onChange={(e) => setExtra({ ...extra, showStats: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-border text-[#c6a15b] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <Label htmlFor="showStats" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                          পরিসংখ্যান
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showOffer"
                          checked={extra.showOffer}
                          onChange={(e) => setExtra({ ...extra, showOffer: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-border text-[#c6a15b] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <Label htmlFor="showOffer" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                          অফার কাউন্টডাউন
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showCart"
                          checked={extra.showCart}
                          onChange={(e) => setExtra({ ...extra, showCart: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-border text-[#c6a15b] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <Label htmlFor="showCart" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none">
                          কার্ট/অর্ডার বাটন
                        </Label>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">গড় রেটিং (যেমন: ৪.৯)</Label>
                        <Input
                          type="text"
                          value={extra.ratingAverage}
                          onChange={(e) => setExtra({ ...extra, ratingAverage: e.target.value })}
                          className="bg-background focus-visible:border-[#c6a15b]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">রিভিউ সংখ্যা (যেমন: ১,২৪৮)</Label>
                        <Input
                          type="text"
                          value={extra.ratingCount}
                          onChange={(e) => setExtra({ ...extra, ratingCount: e.target.value })}
                          className="bg-background focus-visible:border-[#c6a15b]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">রেটিং বার (৫টি কমা-বিভক্ত %, উদা: 92,6,2,0,0)</Label>
                        <Input
                          type="text"
                          value={extra.ratingBarsText}
                          onChange={(e) => setExtra({ ...extra, ratingBarsText: e.target.value })}
                          className="bg-background focus-visible:border-[#c6a15b]"
                        />
                      </div>
                    </div>

                    {/* Offer details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">অফার শিরোনাম</Label>
                        <Input
                          type="text"
                          value={extra.offerTitle}
                          onChange={(e) => setExtra({ ...extra, offerTitle: e.target.value })}
                          className="bg-background focus-visible:border-[#c6a15b]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">অফার শেষ হওয়ার তারিখ ও সময় (ঐচ্ছিক, YYYY-MM-DDTHH:MM:SS)</Label>
                        <Input
                          type="text"
                          placeholder="2026-12-31T23:59:59"
                          value={extra.offerEndsAt}
                          onChange={(e) => setExtra({ ...extra, offerEndsAt: e.target.value })}
                          className="bg-background focus-visible:border-[#c6a15b]"
                        />
                      </div>
                    </div>

                    {/* Payment methods & navigation links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">পেমেন্ট মেথড (কমা-বিভক্ত: visa,mastercard,bkash,nagad,rocket,cod)</Label>
                        <Input
                          type="text"
                          value={extra.paymentMethodsText}
                          onChange={(e) => setExtra({ ...extra, paymentMethodsText: e.target.value })}
                          className="bg-background focus-visible:border-[#c6a15b]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">ন্যাভিগেশন লিংকসমূহ (Label | Anchor)</Label>
                        <Textarea
                          value={extra.navText}
                          onChange={(e) => setExtra({ ...extra, navText: e.target.value })}
                          rows={4}
                          className="bg-background resize-none focus-visible:border-[#c6a15b] text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">প্রোডাক্ট স্পেসিফিকেশন (প্রতি লাইনে: Label | Value)</Label>
                      <Textarea
                        value={extra.specsText}
                        onChange={(e) => setExtra({ ...extra, specsText: e.target.value })}
                        rows={6}
                        className="bg-background resize-none focus-visible:border-[#c6a15b] leading-relaxed text-xs font-mono"
                      />
                    </div>

                    {/* Stats */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">পরিসংখ্যান কাউন্টার (প্রতি লাইনে: Value | Label)</Label>
                      <Textarea
                        value={extra.statsText}
                        onChange={(e) => setExtra({ ...extra, statsText: e.target.value })}
                        rows={4}
                        className="bg-background resize-none focus-visible:border-[#c6a15b] leading-relaxed text-xs font-mono"
                      />
                    </div>

                    {/* Reviews */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">গ্রাহক রিভিউ তালিকা (প্রতি লাইনে: Name | City/Badge | Comment | Rating(1-5) | ImageURL)</Label>
                      <Textarea
                        value={extra.reviewsText}
                        onChange={(e) => setExtra({ ...extra, reviewsText: e.target.value })}
                        rows={6}
                        className="bg-background resize-none focus-visible:border-[#c6a15b] leading-relaxed text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Images Panel */}
            <div className="md:col-span-1 space-y-6">
              <div className="premium-card bg-card p-6 rounded-2xl space-y-4 sticky top-24">
                <h3
                  className={cn(
                    "font-bold text-sm border-b border-border/40 pb-2 flex items-center gap-2 transition-colors duration-300",
                    activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  <ImageIcon size={16} /> প্রোডাক্ট গ্যালারি ছবি
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  আপনার কম্পিউটার থেকে সরাসরি একাধিক প্রোডাক্টের ছবি আপলোড করুন অথবা স্টোরফ্রন্টে দেখানোর জন্য ছবির লিংক পেস্ট করুন।
                </p>

                {/* File Upload drag/drop area */}
                <div className="border border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition duration-200 bg-muted/20 relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary group-hover:scale-105 transition-transform duration-200">
                      <Plus size={16} />
                    </div>
                    <p className="text-xs font-bold text-foreground">লোকাল ছবি আপলোড করুন</p>
                    <p className="text-[9px] text-muted-foreground">PNG, JPG বা WebP সাপোর্ট করে</p>
                  </div>
                </div>

                {/* Image Variant list */}
                <div className="space-y-4">
                  {formData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="space-y-1.5 p-3.5 bg-muted/30 border border-border/50 rounded-xl relative group"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute right-2 top-2 p-1 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer border-none opacity-0 group-hover:opacity-100 duration-200"
                        title="ছবি মুছুন"
                      >
                        <Trash2 size={13} />
                      </button>
                      <Label htmlFor={`img-${idx}`} className="text-xs font-semibold text-foreground block pr-6">
                        {idx === 0 ? 'প্রধান কভার ইমেজ (১)' : `গ্যালারি ইমেজ (${idx + 1})`}
                      </Label>
                      <Input
                        id={`img-${idx}`}
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className={cn(
                          "mt-1 bg-background text-xs focus-visible:border-primary",
                          activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                        )}
                      />
                      {imgUrl && (
                        <div className="mt-2 relative aspect-video w-full rounded-lg overflow-hidden border border-border/40 bg-muted">
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Image variant color mapper */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <Label className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                          ছবির রং:
                        </Label>
                        <select
                          value={formData.imageColors && formData.imageColors[idx] || ''}
                          onChange={(e) => handleImageColorChange(idx, e.target.value)}
                          className={cn(
                            "w-full text-[10px] border border-border/60 p-1.5 rounded-lg focus:outline-none bg-background focus:ring-0 transition-all duration-250 focus:border-primary",
                            activeTemplate === 1 ? "focus-visible:border-[#1a365d]" : "focus-visible:border-indigo-600"
                          )}
                        >
                          <option value="">সাধারণ / কোনো নির্দিষ্ট রং নেই (Default)</option>
                          {formData.colors.split(',').map((s) => s.trim()).filter(Boolean).map((color) => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty slot controller */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-muted-foreground">
                    {formData.images.length}টি ইমেজ স্লট
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({
                      ...formData,
                      images: [...formData.images, ''],
                      imageColors: [...(formData.imageColors || []), '']
                    })}
                    className="text-[10px] h-7 px-2.5 flex items-center gap-1 border border-border bg-card cursor-pointer font-bold rounded-lg"
                  >
                    <Plus size={10} /> খালি স্লট যোগ করুন
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer sticky bar */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-background/80 backdrop-blur-md border-t border-border/70 py-4 px-6 md:px-8 z-30 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info
              size={14}
              className={activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-600"}
            />
            <span>পরিবর্তনগুলো সরাসরি পাবলিক স্টোরফ্রন্টে আপডেট হয়ে যাবে।</span>
          </div>

          <div className="flex items-center gap-4">
            {saveError && (
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full animate-bounce">
                ⚠️ {saveError}
              </span>
            )}
            {saveStatus === 'saved' && !saveError && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                🎉 পরিবর্তনগুলো সফলভাবে সংরক্ষিত হয়েছে!
              </span>
            )}
            <Button
              type="submit"
              disabled={saveStatus === 'saving'}
              className={cn(
                "px-6 py-2.5 shadow-md font-bold rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer border-none text-white",
                activeTemplate === 1
                  ? "bg-[#1a365d] hover:bg-[#1a365d]/90 shadow-[#1a365d]/10"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10"
              )}
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                <>
                  <Save size={16} />
                  পরিবর্তন সংরক্ষণ করুন
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Live Preview dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className={cn("max-w-[95vw] md:max-w-[70vw] h-[92vh] flex flex-col p-0 overflow-hidden bg-white border transition-all duration-300", activeTemplate === 1 ? "border-[#1a365d]/20" : "border-indigo-100")}>
          <DialogHeader className={cn("p-4 border-b transition-all duration-300 text-slate-900", activeTemplate === 1 ? "border-[#1a365d]/10 bg-[#1a365d]/5" : "border-indigo-100 bg-indigo-50/40")}>
            <div>
              <DialogTitle className={cn("text-base font-bold flex items-center gap-2", activeTemplate === 1 ? "text-[#1a365d]" : "text-indigo-950")}>
                <Eye size={18} />
                Storefront Live Preview (Template {activeTemplate})
              </DialogTitle>
              <p className="text-[10px] mt-1 text-slate-500">
                This is an interactive preview of how the landing page layout appears with your current form data.
              </p>
            </div>
          </DialogHeader>
          <div 
            className="flex-1 overflow-y-auto"
            style={{
              colorScheme: 'light',
              backgroundColor: '#f8fafc',
              color: 'oklch(0.18 0.02 240)',
              // Force light-theme CSS variables for the preview container
              '--background': 'oklch(0.975 0.015 240)',
              '--foreground': 'oklch(0.18 0.02 240)',
              '--card': 'oklch(1 0 0)',
              '--card-foreground': 'oklch(0.18 0.02 240)',
              '--popover': 'oklch(1 0 0)',
              '--popover-foreground': 'oklch(0.18 0.02 240)',
              '--muted': 'oklch(0.94 0.01 240)',
              '--muted-foreground': 'oklch(0.5 0.02 240)',
              '--border': 'oklch(0.91 0.015 240)',
              '--input': 'oklch(0.91 0.015 240)'
            } as any}
          >
            <LandingPage 
              isPreview={true}
              product={{
                ...product,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                stock: parseInt(formData.stock) || 0,
                sku: formData.sku,
                discount: parseFloat(formData.discount) || 0,
                videoUrl: formData.videoUrl,
                heroBadges: formData.heroBadges.split(',').map((s) => s.trim()).filter(Boolean),
                features: formData.features.split('\n').map((s) => s.trim()).filter(Boolean),
                faqs: faqs.filter((f) => f.q.trim() && f.a.trim()),
                images: formData.images.filter(Boolean),
                imageColors: formData.imageColors,
                templateId: activeTemplate,
                sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
                colors: formData.colors.split(',').map((s) => s.trim()).filter(Boolean),
                storeName: formData.storeName,
                storeTagline: formData.storeTagline,
                storePhone: formData.storePhone,
                whatsappNumber: formData.whatsappNumber,
                heroTitle: formData.heroTitle,
                heroSubtitle: formData.heroSubtitle,
                customerStatsTitle: formData.customerStatsTitle,
                customerStatsDesc: formData.customerStatsDesc,
                deliveryDhaka: formData.deliveryDhaka,
                deliveryOutside: formData.deliveryOutside,
                outOfStockSizes: formData.outOfStockSizes,
                showVideo: formData.showVideo,
                showFaqs: formData.showFaqs,
                showReviews: formData.showReviews,
                showFeatures: formData.showFeatures,
                showSizes: formData.showSizes,
                showColors: formData.showColors,
                showBadges: formData.showBadges,
                facebookUrl: formData.facebookUrl,
                instagramUrl: formData.instagramUrl,
                youtubeUrl: formData.youtubeUrl,
                specs: parsePipe(extra.specsText, ['label', 'value']).map((o) => ({ label: o.label, value: o.value })),
                productReviews: parsePipe(extra.reviewsText, ['name', 'city', 'text', 'rating', 'image']).map((r: Record<string, string>) => ({ name: r.name, city: r.city, text: r.text, rating: Number(r.rating) || 5, image: r.image || '' })),
                stats: parsePipe(extra.statsText, ['value', 'label']).map((o) => ({ value: o.value, label: o.label })),
                navLinks: parsePipe(extra.navText, ['label', 'anchor']).map((o) => ({ label: o.label, anchor: o.anchor })),
                ratingAverage: extra.ratingAverage,
                ratingCount: extra.ratingCount,
                ratingBars: extra.ratingBarsText.split(',').map((n) => Number(n.trim()) || 0).slice(0, 5),
                paymentMethods: extra.paymentMethodsText.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean),
                offerTitle: extra.offerTitle,
                offerEndsAt: extra.offerEndsAt,
                showSpecs: extra.showSpecs,
                showStats: extra.showStats,
                showOffer: extra.showOffer,
                showCart: extra.showCart
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
