import Sidebar from '@/components/dashboard/sidebar';
import Navbar from '@/components/dashboard/navbar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <Navbar />
      <main className="md:ml-64 pt-[72px] md:pt-20 min-h-screen bg-background">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </>
  );
}
