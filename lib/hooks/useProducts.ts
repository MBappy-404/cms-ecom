'use client';

import { useState, useCallback, useEffect } from 'react';
import { products as initialProducts } from '../dummy-data';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('products');
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
        } catch (e) {
          setProducts(initialProducts);
        }
      } else {
        setProducts(initialProducts);
      }
    }
  }, []);

  const saveProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('products', JSON.stringify(newProducts));
    }
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    saveProducts([newProduct, ...products]);
    return newProduct;
  }, [products, saveProducts]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    const updated = products.map((product) =>
      product.id === id ? { ...product, ...updates } : product
    );
    saveProducts(updated);
  }, [products, saveProducts]);

  const deleteProduct = useCallback((id: string) => {
    const updated = products.filter((product) => product.id !== id);
    saveProducts(updated);
  }, [products, saveProducts]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
