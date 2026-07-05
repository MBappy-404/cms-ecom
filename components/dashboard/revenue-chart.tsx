'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  return (
    <div className="premium-card bg-card border border-border/60 rounded-2xl p-6 shadow-3xs flex flex-col justify-between h-96">
      <div>
        <h3 className="font-extrabold text-base text-[#1a365d] mb-1">মোট বিক্রয় রেখাচিত্র (Sales Revenue)</h3>
        <p className="text-[10px] text-muted-foreground font-semibold mb-6">গত ৭ মাসের মোট বিক্রয় রাজস্বের পরিসংখ্যান</p>
      </div>
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
              labelStyle={{ color: '#1e293b' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
