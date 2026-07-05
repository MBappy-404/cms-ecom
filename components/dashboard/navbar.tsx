'use client';

import { Bell, Search, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useState } from 'react';
export default function Navbar() {
  const { isDark, toggle, mounted } = useDarkMode();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="md:ml-64 bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
      <div className="px-6 md:px-8 py-4 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 hidden sm:flex items-center gap-3 bg-muted/40 border border-border/60 rounded-xl px-4 py-2 hover:border-border transition-all duration-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 max-w-md">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, orders, categories..."
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground text-foreground"
          />
          <kbd className="hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/80 bg-background px-1.5 font-mono text-[9px] font-bold text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggle}
              className="p-2.5 hover:bg-muted border border-border/30 dark:border-border/10 bg-background/50 rounded-xl transition duration-200 text-muted-foreground hover:text-foreground cursor-pointer shadow-xs"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-2.5 hover:bg-muted border border-border/30 dark:border-border/10 bg-background/50 rounded-xl transition duration-200 text-muted-foreground hover:text-foreground cursor-pointer shadow-xs">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-sm" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-muted border border-border/40 rounded-xl transition-all duration-200 cursor-pointer bg-background/50"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/10">
                A
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-foreground">Admin</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-3 duration-200">
                <div className="px-4 py-2 border-b border-border mb-1.5">
                  <p className="text-xs text-muted-foreground font-medium">Signed in as</p>
                  <p className="text-sm font-semibold text-foreground truncate">admin@shopcms.com</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-sm font-medium transition-colors text-foreground text-left border-none cursor-pointer">
                  <Settings size={16} className="text-muted-foreground" />
                  Account Settings
                </button>
                <div className="border-t border-border my-1.5" />
                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-destructive/10 hover:text-destructive text-sm font-medium transition-colors text-muted-foreground hover:text-destructive text-left border-none cursor-pointer">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
