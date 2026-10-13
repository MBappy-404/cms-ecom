'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import Template1 from '@/components/public/template-1';
import Template2 from '@/components/public/template-2';
import Template3 from '@/components/public/template-3';

interface LandingPageProps {
  product: Product;
  isPreview?: boolean;
}

export default function LandingPage({ product, isPreview = false }: LandingPageProps) {
  // Template selector
  const [activeTemplate, setActiveTemplate] = useState<1 | 2 | 3>(
    (product?.templateId === 3 ? 3 : product?.templateId === 2 ? 2 : 1)
  );

  useEffect(() => {
    if (product?.templateId) {
      // Map database templateId values to supported options (1 or 2)
      // Since template 3 in DB corresponds to our Template 2, map 3 to 2
      const mappedId = product.templateId === 3 ? 3 : (product.templateId === 2 ? 2 : 1);
      setActiveTemplate(mappedId as 1 | 2 | 3);
    }
  }, [product]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Floating Selector to Preview Template 1, 2 or 3 */}
      <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-lg p-1.5 shadow-2xl flex items-center gap-1.5 transition-all duration-200">
        <span className="text-[9px] font-bold text-slate-400 uppercase px-2 select-none">টেমপ্লেট:</span>
        <button
          onClick={() => setActiveTemplate(1)}
          className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition-all duration-250 cursor-pointer ${activeTemplate === 1
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
        >
          টেমপ্লেট ১
        </button>
        <button
          onClick={() => setActiveTemplate(2)}
          className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition-all duration-250 cursor-pointer ${activeTemplate === 2
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
        >
          টেমপ্লেট ২
        </button>
        <button
          onClick={() => setActiveTemplate(3)}
          className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition-all duration-250 cursor-pointer ${activeTemplate === 3
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
        >
          টেমপ্লেট ৩
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTemplate === 1 ? (
          <Template1 key="template1" product={product} />
        ) : activeTemplate === 2 ? (
          <Template2 key="template2" product={product} />
        ) : (
          <Template3 key="template3" product={product} />
        )}
      </AnimatePresence>
    </div>
  );
}
