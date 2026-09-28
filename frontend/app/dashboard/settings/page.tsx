import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const businessId = searchParams.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // If no specific business ID is passed, we can either ask them to select one 
  // or default to the latest one they own.
  let business;

  if (businessId) {
    const { data } = await supabase
      .from('business_demos')
      .select('*')
      .eq('id', businessId)
      .eq('user_id', user.id)
      .single();
    business = data;
  } else {
    // Get latest active business
    const { data } = await supabase
      .from('business_demos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    business = data;
  }

  if (!business) {
    return (
      <div className="p-8 text-center bg-[#14141A] border border-[#262633] rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Bisnis Tidak Ditemukan</h2>
        <p className="text-[#8E8EA0]">Anda belum memiliki website bisnis yang aktif atau bisnis tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-black text-white">Kelola Informasi Bisnis</h2>
        <p className="text-[#8E8EA0] mt-1">Perbarui nama, kontak, dan daftar menu/layanan yang tampil di website Anda.</p>
      </div>

      <div className="bg-[#14141A] border border-[#262633] rounded-2xl overflow-hidden shadow-xl">
        <SettingsForm initialData={business} />
      </div>
    </div>
  );
}
