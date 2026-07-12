'use client';

import { ElementType } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  trend?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  index?: number;
}

// Static class maps — full class strings kept literal so Tailwind never purges them
const colorStyles = {
  blue: {
    gradient: 'from-blue-500/10 to-indigo-500/10',
    accent: 'bg-blue-500',
    icon: 'from-blue-500 to-indigo-500',
    glow: 'shadow-blue-500/20',
  },
  green: {
    gradient: 'from-emerald-500/10 to-teal-500/10',
    accent: 'bg-emerald-500',
    icon: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
  },
  purple: {
    gradient: 'from-purple-500/10 to-fuchsia-500/10',
    accent: 'bg-purple-500',
    icon: 'from-purple-500 to-fuchsia-500',
    glow: 'shadow-purple-500/20',
  },
  orange: {
    gradient: 'from-orange-500/10 to-amber-500/10',
    accent: 'bg-orange-500',
    icon: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/20',
  },
} as const;

// Helper function to translate English numbers to Bengali
function toBanglaNum(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
}

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue', index = 0 }: StatCardProps) {
  const banglaValue = typeof value === 'number' ? toBanglaNum(value) : toBanglaNum(String(value));
  const styles = colorStyles[color];
  const positive = (trend ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        'group surface relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between h-36 bg-gradient-to-br',
        styles.gradient
      )}
    >
      {/* Left accent bar that grows on hover */}
      <span className={cn('absolute left-0 top-5 bottom-5 w-1 rounded-full opacity-70 transition-all duration-300 group-hover:top-3 group-hover:bottom-3', styles.accent)} />

      <div className="flex justify-between items-start">
        <div className="space-y-1 pl-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
          <h3 className="text-2xl font-black text-foreground tabular-nums">{banglaValue}</h3>
        </div>
        <div
          className={cn(
            'p-2.5 rounded-xl text-white shadow-lg bg-gradient-to-br transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3',
            styles.icon,
            styles.glow
          )}
        >
          <Icon size={16} />
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold pl-1">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-1.5 py-0.5',
              positive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            )}
          >
            {positive ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
            {toBanglaNum(Math.abs(trend))}%
          </span>
          <span className="text-muted-foreground">গত মাস থেকে বৃদ্ধি</span>
        </div>
      )}
    </motion.div>
  );
}
