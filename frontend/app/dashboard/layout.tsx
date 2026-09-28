import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // If not logged in, boot them out
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white">
      <DashboardSidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 border-b border-[#262633] bg-[#14141A] flex items-center justify-between px-8">
          <h1 className="text-xl font-bold">Halo, Pengusaha!</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user.email}</p>
              <p className="text-xs text-[#00b894]">Akun Pro</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#262633] border-2 border-[#00b894] flex items-center justify-center text-sm font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
