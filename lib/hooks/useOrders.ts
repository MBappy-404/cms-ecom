'use client';

import { useState, useCallback, useEffect } from 'react';
import { orders as initialOrders } from '../dummy-data';
import { Order } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('orders');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // ensure dates are Date objects
          const formatted = parsed.map((o: any) => ({
            ...o,
            createdAt: new Date(o.createdAt || Date.now())
          }));
          setOrders(formatted);
        } catch (e) {
          setOrders(initialOrders);
        }
      } else {
        setOrders(initialOrders);
        localStorage.setItem('orders', JSON.stringify(initialOrders));
      }
    }
  }, []);

  const saveOrders = useCallback((newOrders: Order[]) => {
    setOrders(newOrders);
    if (typeof window !== 'undefined') {
      localStorage.setItem('orders', JSON.stringify(newOrders));
      window.dispatchEvent(new Event('orders-updated'));
    }
  }, []);

  const addOrder = useCallback((order: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    saveOrders([newOrder, ...orders]);
    return newOrder;
  }, [orders, saveOrders]);

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, ...updates } : order
    );
    saveOrders(updated);
  }, [orders, saveOrders]);

  const deleteOrder = useCallback((id: string) => {
    const updated = orders.filter((order) => order.id !== id);
    saveOrders(updated);
  }, [orders, saveOrders]);

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
  };
}
