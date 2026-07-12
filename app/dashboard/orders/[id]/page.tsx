'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Truck, User, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/lib/hooks/useOrders';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  processing: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  shipped: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const statusLabels: Record<string, string> = {
  pending: 'পেন্ডিং (Pending)',
  confirmed: 'কনফার্মড (Confirmed)',
  processing: 'প্রসেসিং (Processing)',
  shipped: 'শিপড (Shipped)',
  delivered: 'ডেলিভারড (Delivered)',
  cancelled: 'বাতিলকৃত (Cancelled)',
};

// Helper function to translate English numbers to Bengali
function toBanglaNum(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const { orders, updateOrder } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/orders">
          <Button variant="outline" className="gap-2 font-bold cursor-pointer rounded-xl text-xs">
            <ArrowLeft size={16} />
            অর্ডার তালিকায় ফিরে যান
          </Button>
        </Link>
        <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-xs">
          <p className="text-muted-foreground font-semibold">অর্ডারটি খুঁজে পাওয়া যায়নি!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-16"
    >
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/orders">
          <Button variant="outline" className="gap-2 font-bold cursor-pointer rounded-xl text-xs">
            <ArrowLeft size={16} />
            অর্ডার তালিকায় ফিরে যান
          </Button>
        </Link>
      </div>

      {/* Header Info */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            অর্ডার রসিদ
          </span>
          <h1 className="text-2xl font-black mt-3 text-foreground tracking-tight">{order.id}</h1>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            অর্ডার তারিখ: {toBanglaNum(order.createdAt.toLocaleDateString())}
          </p>
        </div>
        
        {/* Status Control */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={cn("px-3 py-1 rounded-full border text-xs font-bold shadow-3xs", statusColors[order.status])} variant="outline">
            {statusLabels[order.status].split(' ')[0]}
          </Badge>
          
          <select
            value={order.status}
            onChange={(e) => updateOrder(order.id, { status: e.target.value as any })}
            className="px-3 py-2 bg-muted border border-border outline-none text-xs rounded-xl font-bold text-foreground cursor-pointer focus:ring-0 focus:border-slate-400 transition"
          >
            <option value="pending">পেন্ডিং (Pending)</option>
            <option value="confirmed">কনফার্মড (Confirmed)</option>
            <option value="processing">প্রসেসিং (Processing)</option>
            <option value="shipped">শিপড (Shipped)</option>
            <option value="delivered">ডেলিভারড (Delivered)</option>
            <option value="cancelled">বাতিলকৃত (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items and Shipping details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-brand-ink mb-5 flex items-center gap-2">
              <Package size={18} className="text-brand-ink" /> অর্ডার আইটেমসমূহ
            </h2>

            <div className="divide-y divide-border/65">
              {order.products.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      পরিমাণ: {toBanglaNum(item.quantity)} টি
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-brand-ink">৳ {toBanglaNum(item.subtotal)}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">
                      প্রতিটি ৳ {toBanglaNum(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-brand-ink mb-5 flex items-center gap-2">
              <Truck size={18} className="text-brand-ink" /> ডেলিভারি ও পেমেন্ট তথ্য
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">ডেলিভারি ঠিকানা</p>
                <p className="text-sm font-semibold text-foreground leading-relaxed">{order.shippingAddress}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">পেমেন্ট মেথড</p>
                <p className="text-sm font-semibold text-foreground">
                  {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (COD)' : order.paymentMethod}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Customer and Summary */}
        <div className="space-y-6">
          
          {/* Customer Profile */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-brand-ink mb-5 flex items-center gap-2">
              <User size={18} className="text-brand-ink" /> কাস্টমার প্রোফাইল
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">নাম</p>
                <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">ফোন নম্বর</p>
                <p className="text-sm font-bold text-foreground font-sans">
                  {toBanglaNum(order.customerEmail)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">পেমেন্ট স্ট্যাটাস</p>
              <h4 className="text-sm font-extrabold text-foreground">
                {order.paymentStatus === 'paid' ? 'পরিশোধিত (Paid)' : 'অপরিশোধিত (Unpaid)'}
              </h4>
            </div>
            <Badge
              className={cn(
                "px-2.5 py-0.5 rounded-full border text-[10px] font-bold shadow-3xs",
                order.paymentStatus === 'paid'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
              )}
              variant="outline"
            >
              {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </Badge>
          </div>

          {/* Order Summary Billing */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-brand-ink mb-5 flex items-center gap-2">
              <CreditCard size={18} className="text-brand-ink" /> বিলিং সারসংক্ষেপ
            </h2>

            <div className="space-y-3.5 text-sm font-medium">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>উপ-মোট (Subtotal)</span>
                <span className="font-bold text-foreground">৳ {toBanglaNum(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>ডেলিভারি চার্জ (Shipping)</span>
                <span className="font-bold text-foreground">৳ {toBanglaNum(order.shipping)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>ভ্যাট/ট্যাক্স (Tax)</span>
                <span className="font-bold text-foreground">৳ {toBanglaNum(order.tax)}</span>
              </div>
              <div className="pt-4 border-t border-border/80 flex justify-between items-center font-extrabold text-base text-brand-ink">
                <span>সর্বমোট (Total)</span>
                <span>৳ {toBanglaNum(order.total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
