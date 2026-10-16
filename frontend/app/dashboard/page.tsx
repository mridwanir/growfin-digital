import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Store, Globe, ArrowRight, Activity, CalendarDays, MousePointerClick, MessageCircle, Eye } from 'lucide-react';
import { CreateWebsiteButton } from '@/components/dashboard/CreateWebsiteButton';
import { ShareWebsiteButton } from '@/components/dashboard/ShareWebsiteModal';

export default async function DashboardOverview() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the user's businesses
  const { data: businesses } = await supabase
    .from('business_demos')
    .select('id, name, slug, category, city, status, package_tier, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  // Fetch Analytics Data (both WhatsApp clicks and page views)
  let analyticsData: any[] = [];
  if (businesses && businesses.length > 0) {
    const businessIds = businesses.map(b => b.id);
    const { data: events } = await supabase
      .from('analytics_events')
      .select('business_id, event_type')
      .in('business_id', businessIds);
    
    analyticsData = events || [];
  }

  const totalWaClicks = analyticsData.filter(e => e.event_type === 'whatsapp_click').length;
  const totalPageViews = analyticsData.filter(e => e.event_type === 'page_view').length;
  const conversionRate = totalPageViews > 0 
    ? ((totalWaClicks / totalPageViews) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Ringkasan Bisnis</h2>
        <p className="text-[#8E8EA0] mt-1">Pantau status website dan layanan bisnis digital Anda di sini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#14141A] border border-[#262633] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-2">
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
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-[#8E8EA0] text-sm font-semibold">Total Pengunjung (Views)</p>
              <h3 className="text-2xl font-black text-white">{totalPageViews}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#14141A] border border-[#262633] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-[#8E8EA0] text-sm font-semibold">Total Prospek (Leads WA)</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-white">{totalWaClicks}</h3>
                {totalPageViews > 0 && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {conversionRate}% konversi
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#14141A] border border-[#262633] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-2">
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
            {businesses.map((biz) => {
              const bizClicks = analyticsData.filter(e => e.business_id === biz.id && e.event_type === 'whatsapp_click').length;
              const bizViews = analyticsData.filter(e => e.business_id === biz.id && e.event_type === 'page_view').length;
              const bizConversion = bizViews > 0 ? ((bizClicks / bizViews) * 100).toFixed(1) : null;
              return (
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
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <p className="text-xs text-[#8E8EA0] flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" /> Dibuat {new Date(biz.created_at).toLocaleDateString('id-ID')}
                      </p>
                      <p className="text-xs text-blue-400 flex items-center gap-1 font-semibold bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                        <Eye className="w-3.5 h-3.5" /> {bizViews} Pengunjung
                      </p>
                      <p className="text-xs text-[#00b894] flex items-center gap-1 font-semibold bg-[#00b894]/10 px-2.5 py-0.5 rounded-full">
                        <MessageCircle className="w-3.5 h-3.5" /> {bizClicks} Prospek WA
                        {bizConversion !== null && (
                          <span className="text-[10px] text-emerald-400/80 font-normal ml-0.5">({bizConversion}%)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <ShareWebsiteButton business={biz} />
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
