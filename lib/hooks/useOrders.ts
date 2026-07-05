'use client';

import { useState, useCallback } from 'react';
import { orders as initialOrders } from '../dummy-data';
import { Order } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = useCallback((order: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      )
    );
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }, []);

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
  };
}
