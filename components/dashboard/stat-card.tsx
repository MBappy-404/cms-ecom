'use client';

import { ElementType } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  trend?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorStyles = {
  blue: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500',
  green: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500',
  purple: 'from-purple-500/10 to-fuchsia-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500',
  orange: 'from-orange-500/10 to-amber-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 bg-orange-500',
};

// Helper function to translate English numbers to Bengali
function toBanglaNum(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
}

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  const banglaValue = typeof value === 'number' ? toBanglaNum(value) : toBanglaNum(String(value));
  
  return (
    <div className={cn(
      "relative overflow-hidden bg-card border border-border/60 rounded-2xl p-6 shadow-3xs flex flex-col justify-between h-36 bg-gradient-to-br transition-all duration-300 hover:shadow-xs",
      colorStyles[color].split(' ').slice(0, 3).join(' ')
    )}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
          <h3 className="text-2xl font-black text-foreground">{banglaValue}</h3>
        </div>
        <div className={cn("p-2.5 rounded-xl text-white shadow-md shadow-current/10 bg-gradient-to-br", colorStyles[color].split(' ').slice(4).join(' '))}>
          <Icon size={16} />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-4 text-[10px] font-bold">
          <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5", 
            trend > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
          )}>
            {trend > 0 ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
            {toBanglaNum(Math.abs(trend))}%
          </span>
          <span className="text-muted-foreground">গত মাস থেকে বৃদ্ধি</span>
        </div>
      )}
    </div>
  );
}
