'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { products as initialProducts } from '@/lib/dummy-data';
import { Product } from '@/lib/types';
import LandingPage from '@/components/public/landing-page';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ProductLandingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('products');
      const productsList: Product[] = stored ? JSON.parse(stored) : initialProducts;
      const found = productsList.find((p) => p.slug === slug);
      setProduct(found || null);
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist.</p>
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft size={16} className="mr-2 inline" />
          Browse Products
        </Link>
      </div>
    );
  }

  return <LandingPage product={product} />;
}
