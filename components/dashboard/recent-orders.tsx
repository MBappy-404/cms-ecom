'use client';

import { orders } from '@/lib/dummy-data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  processing: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  shipped: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
};

const statusLabels: Record<string, string> = {
  pending: 'পেন্ডিং',
  confirmed: 'কনফার্মড',
  processing: 'প্রসেসিং',
  shipped: 'শিপড',
  delivered: 'ডেলিভারড',
  cancelled: 'বাতিলকৃত',
};

// Helper function to translate English numbers to Bengali
function toBanglaNum(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
}

export default function RecentOrders() {
  const recent = orders.slice(0, 5);

  return (
    <div className="premium-card bg-card border border-border/60 rounded-2xl p-6 shadow-3xs space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-base text-[#1a365d] mb-1">সাম্প্রতিক অর্ডারসমূহ (Recent Orders)</h3>
          <p className="text-[10px] text-muted-foreground font-semibold">সদ্য আসা ৫টি অর্ডারের বিবরণ</p>
        </div>
        <Link href="/dashboard/orders" className="text-xs font-bold text-indigo-600 hover:underline">
          সব অর্ডার দেখুন →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs font-bold text-muted-foreground">
              <th className="pb-3">অর্ডার আইডি</th>
              <th className="pb-3">কাস্টমার</th>
              <th className="pb-3">মূল্য</th>
              <th className="pb-3 text-right">স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs">
            {recent.map((order) => (
              <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                <td className="py-3.5 font-bold text-primary">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    {order.id}
                  </Link>
                </td>
                <td className="py-3.5">
                  <span className="font-semibold text-foreground block">{order.customerName}</span>
                  <span className="text-[10px] text-muted-foreground font-sans block">{order.customerEmail}</span>
                </td>
                <td className="py-3.5 font-bold text-foreground">
                  ৳ {toBanglaNum(order.total)}
                </td>
                <td className="py-3.5 text-right">
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold shadow-3xs", statusColors[order.status])}>
                    {statusLabels[order.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
