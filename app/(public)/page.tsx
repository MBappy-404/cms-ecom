'use client';

import { useState, useEffect } from 'react';
import { products as initialProducts } from '@/lib/dummy-data';
import { Product } from '@/lib/types';
import LandingPage from '@/components/public/landing-page';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('products');
      const productsList: Product[] = stored ? JSON.parse(stored) : initialProducts;
      setTargetProduct(productsList[0] || null);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 animate-pulse" />
          <Loader2 className="absolute inset-0 m-auto w-6 h-6 animate-spin text-white" />
        </div>
        <p className="text-xs font-semibold text-muted-foreground animate-pulse">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!targetProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <h1 className="text-2xl font-bold">No Products Available</h1>
        <p className="text-muted-foreground">Please add some products in the admin panel.</p>
        <Link
          href="/dashboard/products"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft size={16} className="mr-2 inline" />
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return <LandingPage product={targetProduct} />;
}
