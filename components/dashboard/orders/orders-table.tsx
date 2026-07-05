'use client';

import { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface OrdersTableProps {
  orders: Order[];
  onUpdate: (id: string, updates: Partial<Order>) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  processing: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  shipped: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const statusLabels: Record<string, string> = {
  pending: 'পেন্ডিং',
  confirmed: 'কনফার্মড',
  processing: 'প্রসেসিং',
  shipped: 'শিপড',
  delivered: 'ডেলিভারড',
  cancelled: 'বাতিলকৃত',
};

export default function OrdersTable({ orders, onUpdate, onDelete }: OrdersTableProps) {
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === 'date') return b.createdAt.getTime() - a.createdAt.getTime();
    if (sortBy === 'amount') return b.total - a.total;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  if (sortedOrders.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center">
        <p className="text-muted-foreground">কোনো অর্ডার খুঁজে পাওয়া যায়নি</p>
      </div>
    );
  }

  const sortLabels = {
    date: 'তারিখ',
    amount: 'মূল্য',
    status: 'স্ট্যাটাস',
  };

  return (
    <div className="premium-card overflow-hidden">
      {/* Sort Controls */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-4 bg-card">
        <div className="flex items-center gap-1.5 bg-muted/65 p-1 rounded-xl border border-border/40">
          <span className="text-xs text-muted-foreground px-2 font-medium">সর্ট করুন:</span>
          {(['date', 'amount', 'status'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 cursor-pointer border border-transparent",
                sortBy === type
                  ? "bg-background text-foreground shadow-xs border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {sortLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">অর্ডার আইডি</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">কাস্টমার</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">আইটেম</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">মূল্য</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">স্ট্যাটাস</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">তারিখ</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-border hover:bg-muted/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link href={`/dashboard/orders/${order.id}`} className="font-semibold text-sm text-primary hover:underline">
                    {order.id}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{order.customerEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {order.products.length}টি প্রোডাক্ট
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-sm text-foreground">৳{order.total}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold shadow-xs", statusColors[order.status])}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", 
                      order.status === 'pending' && "bg-amber-500",
                      order.status === 'confirmed' && "bg-blue-500",
                      order.status === 'processing' && "bg-indigo-500",
                      order.status === 'shipped' && "bg-purple-500",
                      order.status === 'delivered' && "bg-emerald-500 animate-pulse",
                      order.status === 'cancelled' && "bg-rose-500"
                    )} />
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {order.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground hover:bg-muted" title="দেখুন">
                        <Eye size={15} />
                      </Button>
                    </Link>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        onUpdate(order.id, { status: e.target.value as any });
                      }}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-muted border border-border/85 outline-none hover:bg-muted/70 focus:border-primary focus:ring-0 transition-all font-semibold text-foreground cursor-pointer"
                      title="আপডেট স্ট্যাটাস"
                    >
                      <option value="pending">পেন্ডিং (Pending)</option>
                      <option value="confirmed">কনফার্মড (Confirmed)</option>
                      <option value="processing">প্রসেসিং (Processing)</option>
                      <option value="shipped">শিপড (Shipped)</option>
                      <option value="delivered">ডেলিভারড (Delivered)</option>
                      <option value="cancelled">বাতিলকৃত (Cancelled)</option>
                    </select>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      className="text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm(`অর্ডারটি ডিলিট করতে চান? আইডি: ${order.id}`)) {
                          onDelete(order.id);
                        }
                      }}
                      title="ডিলিট"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
