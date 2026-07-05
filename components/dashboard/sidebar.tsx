'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Package,
  Layers,
  ShoppingCart,
  Users,
  ImageIcon,
  FileText,
  Settings,
  BarChart3,
  Palette,
  Globe,
  Menu,
  X,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutGrid },
  { href: '/dashboard/products', label: 'ওয়েবসাইট কন্টেন্ট', icon: FileText },
  { href: '/dashboard/orders', label: 'অর্ডারসমূহ', icon: ShoppingCart },
  { href: '/dashboard/reviews', label: 'কাস্টমার রিভিউ', icon: MessageSquare },
  { href: '/dashboard/seo', label: 'এসইও সেটিংস', icon: Globe },
  { href: '/dashboard/theme-settings', label: 'থিম সেটিংস', icon: Palette },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-card text-foreground border border-border/80 backdrop-blur-md rounded-lg transition-colors shadow-lg hover:bg-muted cursor-pointer"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto transition-all duration-300 z-40 flex flex-col justify-between scrollbar-none',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex-1 py-6">
          {/* Logo */}
          <div className="px-6 mb-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <LayoutGrid size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-sidebar-foreground leading-tight">সিএমএস পোর্টাল</span>
                <span className="text-[10px] text-primary font-bold tracking-wider uppercase leading-none mt-0.5">নিয়ন্ত্রণ কেন্দ্র</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : (pathname === item.href || pathname.startsWith(item.href + '/'));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm relative group',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold shadow-inner'
                      : 'text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <Icon 
                    size={18} 
                    className={cn(
                      'transition-colors duration-250',
                      isActive ? 'text-primary' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                    )} 
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout widget */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar/80 backdrop-blur-md sticky bottom-0">
          <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-destructive/10 text-sm text-sidebar-foreground/70 hover:text-destructive transition-all duration-250 font-medium group cursor-pointer border border-transparent hover:border-destructive/20">
            <LogOut size={18} className="text-sidebar-foreground/50 group-hover:text-destructive transition-colors" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>
    </>
  );
}
