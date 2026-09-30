import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Store, Globe, ArrowRight, Activity, CalendarDays } from 'lucide-react';
import { CreateWebsiteButton } from '@/components/dashboard/CreateWebsiteButton';

export default async function DashboardOverview() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the user's businesses
  const { data: businesses } = await supabase
    .from('business_demos')
    .select('id, name, slug, category, status, package_tier, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Ringkasan Bisnis</h2>
        <p className="text-[#8E8EA0] mt-1">Pantau status website dan layanan bisnis digital Anda di sini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#14141A] border border-[#262633] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#00b894]/20 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-[#00b894]" />
            </div>
            <div>
              <p className="text-[#8E8EA0] text-sm font-semibold">Total Website Aktif</p>
              <h3 className="text-2xl font-black text-white">{businesses?.filter(b => b.status === 'published' || b.status === 'paid').length || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#14141A] border border-[#262633] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-[#8E8EA0] text-sm font-semibold">Domain Tersambung</p>
              <h3 className="text-2xl font-black text-white">0</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#14141A] border border-[#262633] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-[#8E8EA0] text-sm font-semibold">Status Langganan</p>
              <h3 className="text-2xl font-black text-white">Lifetime</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Business List */}
      <div className="bg-[#14141A] border border-[#262633] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#262633] flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Daftar Website Bisnis</h3>
          <CreateWebsiteButton />
        </div>

        {(!businesses || businesses.length === 0) ? (
          <div className="p-12 text-center">
            <Store className="w-12 h-12 text-[#262633] mx-auto mb-4" />
            <p className="text-[#8E8EA0]">Anda belum memiliki website bisnis yang aktif.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#262633]">
            {businesses.map((biz) => (
              <div key={biz.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#262633]/30 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-bold text-white">{biz.name}</h4>
                    {biz.status === 'published' || biz.status === 'paid' ? (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#00b894]/20 text-[#00b894]">Aktif</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-500">Pending</span>
                    )}
                  </div>
                  <p className="text-sm text-[#8E8EA0] flex items-center gap-2">
                    {biz.category} • {biz.package_tier || 'Belum ada paket'}
                  </p>
                  <p className="text-xs text-[#8E8EA0] flex items-center gap-1 mt-2">
                    <CalendarDays className="w-3 h-3" /> Dibuat pada {new Date(biz.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'growfin.my.id'}/${biz.slug}`}
                    target="_blank"
                    className="px-4 py-2 border border-[#262633] text-white font-bold rounded-lg hover:bg-[#262633] transition-colors text-sm"
                  >
                    Lihat Web
                  </Link>
                  <Link
                    href={`/demo/${biz.slug}`}
                    className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
                  >
                    Kelola <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
