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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
