'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Package, ShoppingCart, Users } from 'lucide-react';
import { getDashboardStats } from '@/lib/dummy-data';
import StatCard from '@/components/dashboard/stat-card';
import RevenueChart from '@/components/dashboard/revenue-chart';
import RecentOrders from '@/components/dashboard/recent-orders';

export default function DashboardHome() {
  const stats = getDashboardStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">ড্যাশবোর্ড</h1>
        <p className="text-muted-foreground mt-1.5 text-xs font-semibold">স্বাগতম! এখানে আপনার অনলাইন ব্যবসার সংক্ষিপ্ত বিবরণ রয়েছে।</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="মোট অর্ডার"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={12}
          color="blue"
          index={0}
        />
        <StatCard
          title="মোট বিক্রি"
          value={`৳${(stats.totalRevenue / 1000).toFixed(1)}K`}
          icon={TrendingUp}
          trend={8}
          color="green"
          index={1}
        />
        <StatCard
          title="মোট প্রোডাক্ট"
          value={stats.totalProducts}
          icon={Package}
          trend={5}
          color="purple"
          index={2}
        />
        <StatCard
          title="মোট কাস্টমার"
          value={stats.totalCustomers}
          icon={Users}
          trend={15}
          color="orange"
          index={3}
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <RecentOrders />
        </div>
      </div>
    </motion.div>
  );
}
