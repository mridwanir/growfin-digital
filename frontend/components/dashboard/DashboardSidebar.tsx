'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Store, Palette, Globe, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const menuItems = [
  { name: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard, comingSoon: false },
  { name: 'Toko & Bisnis', href: '#', icon: Store, comingSoon: true },
  { name: 'Tampilan & Tema', href: '#', icon: Palette, comingSoon: true },
  { name: 'Domain Kustom', href: '#', icon: Globe, comingSoon: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="w-64 bg-[#0B0B0E] border-r border-[#262633] h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-[#262633]">
        <h2 className="text-xl font-black text-white">Growfin <span className="text-[#00b894]">Dashboard</span></h2>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.comingSoon ? '#' : item.href}
              onClick={(e) => {
                if (item.comingSoon) {
                  e.preventDefault();
                  alert('Fitur ini sedang dalam tahap penyempurnaan (Coming Soon) ✨ Kami sedang menyiapkan sesuatu yang luar biasa untuk Anda!');
                }
              }}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-semibold text-sm ${
                isActive 
                  ? 'bg-[#00b894]/10 text-[#00b894]' 
                  : 'text-[#8E8EA0] hover:bg-[#14141A] hover:text-white'
              } ${item.comingSoon ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                {item.name}
              </div>
              {item.comingSoon && (
                <span className="text-[10px] bg-[#262633] text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Soon</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#262633]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors font-semibold text-sm text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </div>
  );
}
