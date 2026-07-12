'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'জানু', revenue: 4000 },
  { name: 'ফেব্রু', revenue: 3000 },
  { name: 'মার্চ', revenue: 5000 },
  { name: 'এপ্রিল', revenue: 8000 },
  { name: 'মে', revenue: 6000 },
  { name: 'জুন', revenue: 9000 },
  { name: 'জুলাই', revenue: 11000 },
];

export default function RevenueChart() {
  const { isDark } = useDarkMode();

  // Theme-aware chart colors so the graph reads correctly in both modes
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';
  const axisColor = isDark ? '#64748b' : '#94a3b8';
  const stroke = isDark ? '#818cf8' : '#4f46e5';
  const tooltipBg = isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.96)';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const tooltipLabel = isDark ? '#e2e8f0' : '#1e293b';

  return (
    <div className="surface surface-lift bg-card border border-border/60 rounded-2xl p-6 flex flex-col justify-between h-96">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-extrabold text-base text-brand-ink mb-1">মোট বিক্রয় রেখাচিত্র (Sales Revenue)</h3>
          <p className="text-[10px] text-muted-foreground font-semibold">গত ৭ মাসের মোট বিক্রয় রাজস্বের পরিসংখ্যান</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <TrendingUp size={12} /> +১৮%
        </span>
      </div>
      <div className="flex-1 w-full min-h-[220px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} dy={6} />
            <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ stroke, strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.5 }}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(8px)',
              }}
              labelStyle={{ color: tooltipLabel }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={stroke}
              strokeWidth={3}
              fill="url(#revenueFill)"
              dot={{ r: 3, strokeWidth: 2, fill: tooltipBg }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
