'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useOrders } from '@/lib/hooks/useOrders';
import OrdersTable from '@/components/dashboard/orders/orders-table';

export default function OrdersPage() {
  const { orders, updateOrder, deleteOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date range filter
    const now = new Date();
    if (dateRange !== 'all') {
      filtered = filtered.filter((order) => {
        const daysDiff = Math.floor((now.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        if (dateRange === 'week') return daysDiff <= 7;
        if (dateRange === 'month') return daysDiff <= 30;
        if (dateRange === 'year') return daysDiff <= 365;
        return true;
      });
    }

    return filtered;
  }, [searchQuery, statusFilter, dateRange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-sans">অর্ডারসমূহ</h1>
        <p className="text-muted-foreground mt-2">গ্রাহকদের অর্ডারসমূহ পরিচালনা ও ট্র্যাক করুন</p>
      </div>

      {/* Filters */}
      <div className="premium-card p-4 space-y-4 bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1 flex items-center gap-2.5 bg-muted/65 border border-border/50 rounded-xl px-4 py-2 hover:border-border transition-all duration-200 focus-within:border-primary">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="অর্ডার সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-muted/65 border border-border/80 outline-none text-sm rounded-xl focus:border-primary transition-all font-semibold text-foreground cursor-pointer"
          >
            <option value="all">সব স্ট্যাটাস</option>
            <option value="pending">পেন্ডিং (Pending)</option>
            <option value="confirmed">কনফার্মড (Confirmed)</option>
            <option value="processing">প্রসেসিং (Processing)</option>
            <option value="shipped">শিপড (Shipped)</option>
            <option value="delivered">ডেলিভারড (Delivered)</option>
            <option value="cancelled">বাতিলকৃত (Cancelled)</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3.5 py-2 bg-muted/65 border border-border/80 outline-none text-sm rounded-xl focus:border-primary transition-all font-semibold text-foreground cursor-pointer"
          >
            <option value="all">সব সময়</option>
            <option value="week">গত ৭ দিন</option>
            <option value="month">গত ৩০ দিন</option>
            <option value="year">গত ১ বছর</option>
          </select>

          {/* Results count */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium pl-1">
            <Filter size={14} />
            {filteredOrders.length}টি অর্ডার পাওয়া গেছে
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable 
        orders={filteredOrders} 
        onUpdate={updateOrder}
        onDelete={deleteOrder}
      />
    </motion.div>
  );
}
