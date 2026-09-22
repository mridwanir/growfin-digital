export function Pricing() {
  const waInstan = "https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20Template%20Instan.";
  const waPro = "https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20Pro%20Custom.";
  const waEnterprise = "https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20berkonsultasi%20untuk%20Enterprise%20Solutions.";

  return (
    <section id="pricing" className="py-24 bg-[#0B0B0E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#00e0b8] bg-[#00b894]/10 px-3 py-1 rounded-full border border-[#00b894]/20">
            Investment Plans
          </span>
          <h2 className="text-3xl font-black text-[#FFFFFF] sm:text-5xl tracking-tight">
            Harga Terjangkau untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b894] to-[#00e0b8]">UMKM Indonesia</span>
          </h2>
          <p className="text-sm sm:text-lg text-[#8E8EA0] leading-relaxed font-medium">
            Mulai dari template instan yang siap pakai hari ini, hingga solusi software kustom untuk bisnis yang sedang berkembang pesat.
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">

          {/* Card 1: Paket Template Instan */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#14141A] p-8 border border-[#262633] shadow-sm hover:border-[#00b894]/50 transition-all">
            <div className="space-y-6">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#8E8EA0] bg-[#262633] px-3 py-1 rounded-full mb-2">
                  Pemula & UMKM
                </span>
                <h3 className="text-xl font-black text-[#FFFFFF]">Template Instan</h3>
                <p className="text-xs text-[#8E8EA0] mt-1 font-medium">
                  Solusi tercepat. Website live dari template dalam 24 jam.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-[#FFFFFF]">Rp 299rb</span>
                <span className="text-[10px] font-medium text-[#8E8EA0]">Sekali bayar (One-time setup)</span>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-[#8E8EA0] border-t border-[#262633] pt-5">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>1 Template Bisnis Premium</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Live Instan (Maks. 24 Jam)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Kustomisasi Dasar (Warna)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Integrasi WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6">
              <a
                href={waInstan}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#262633] hover:bg-[#00b894]/20 active:scale-98 text-[#FFFFFF] text-xs font-black rounded-2xl shadow-md transition-all border border-[#262633]"
              >
                <span>Pilih Instan ⚡</span>
              </a>
            </div>
          </div>

          {/* Card 2: Paket Pro Basic */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#14141A] p-8 border border-[#262633] shadow-sm hover:border-[#00b894]/50 transition-all">
            <div className="space-y-6">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#00e0b8] bg-[#00b894]/10 px-3 py-1 rounded-full mb-2">
                  Tampil Beda
                </span>
                <h3 className="text-xl font-black text-[#FFFFFF]">Pro Basic</h3>
                <p className="text-xs text-[#8E8EA0] mt-1 font-medium">
                  Custom domain dan desain unik untuk branding yang lebih kuat.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-[#FFFFFF]">Rp 999rb</span>
                <span className="text-[10px] font-medium text-[#8E8EA0]">Sekali bayar (One-time setup)</span>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-[#8E8EA0] border-t border-[#262633] pt-5">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span className="font-bold text-white">Gratis Domain (.com) 1 tahun</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Modifikasi Desain & Layout</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Copywriting Profesional</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Pengerjaan 3-5 Hari</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6">
              <a
                href={waPro} // Boleh disesuaikan URL-nya jika berbeda
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#262633] hover:bg-[#00b894]/20 active:scale-98 text-[#FFFFFF] text-xs font-black rounded-2xl shadow-md transition-all border border-[#262633]"
              >
                <span>Pilih Pro Basic ✨</span>
              </a>
            </div>
          </div>

          {/* Card 3: Paket Pro Custom (FEATURED) */}
          <div className="relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#00b894]/20 to-[#0B0B0E] p-8 text-white shadow-[0_0_30px_rgba(0,184,148,0.15)] border-2 border-[#00b894] transform xl:-translate-y-4">

            {/* Featured Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00b894] to-[#00e0b8] text-[#14141A] text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap">
              🔥 Terpopuler
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#00e0b8] bg-[#00b894]/10 px-3 py-1 rounded-full mb-2 border border-[#00b894]/20">
                  Untuk Bisnis Skala Menengah
                </span>
                <h3 className="text-xl font-black text-white">Pro Advanced</h3>
                <p className="text-xs text-[#8E8EA0] mt-1 font-medium">
                  Sistem operasional otomatis (booking, payment gateway, katalog).
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-white">Rp 2,49 Jt</span>
                <span className="text-[10px] font-medium text-[#8E8EA0]">Sekali bayar (One-time setup)</span>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-[#8E8EA0] border-t border-[#262633] pt-5">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894] text-[#FFFFFF] text-xs font-bold">✓</span>
                  <span className="font-extrabold text-white">Semua Fitur Pro Basic</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894] text-[#FFFFFF] text-xs font-bold">✓</span>
                  <span className="text-[#FFFFFF]">Integrasi Payment Gateway</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894] text-[#FFFFFF] text-xs font-bold">✓</span>
                  <span className="text-[#FFFFFF]">Sistem CMS & Database</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894] text-[#FFFFFF] text-xs font-bold">✓</span>
                  <span className="text-[#FFFFFF]">Sistem Booking/Reservasi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894] text-[#FFFFFF] text-xs font-bold">✓</span>
                  <span className="text-[#FFFFFF]">Pengerjaan 7-14 Hari</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6">
              <a
                href={waPro}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#00b894] to-[#00e0b8] hover:from-[#00e0b8] hover:to-[#00b894] active:scale-98 text-[#14141A] text-xs font-black rounded-2xl shadow-lg transition-all"
              >
                <span>Pilih Advanced 🚀</span>
              </a>
            </div>
          </div>

          {/* Card 4: Paket Enterprise Solutions */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#14141A] p-8 border border-[#262633] shadow-sm hover:border-[#00b894]/50 transition-all">
            <div className="space-y-6">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#8E8EA0] bg-[#262633] px-3 py-1 rounded-full mb-2">
                  Skala Perusahaan
                </span>
                <h3 className="text-xl font-black text-[#FFFFFF]">Enterprise</h3>
                <p className="text-xs text-[#8E8EA0] mt-1 font-medium">
                  Sistem kustom yang dibangun dari nol (from scratch) untuk kebutuhan kompleks.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-[#FFFFFF]">Mulai 15 Jt+</span>
                <span className="text-[10px] font-medium text-[#8E8EA0]">Project based</span>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-[#8E8EA0] border-t border-[#262633] pt-5">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Arsitektur Software Khusus</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Integrasi Model AI (Gemini/GPT)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Sistem Microservices & Cloud</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                  <span>Dukungan Teknis Prioritas</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6">
              <a
                href={waEnterprise}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#262633] hover:bg-[#00b894]/20 active:scale-98 text-[#FFFFFF] text-xs font-black rounded-2xl shadow-md transition-all border border-[#262633]"
              >
                <span>Konsultasi Proyek 💬</span>
              </a>
            </div>
          </div>

        </div>

        {/* Contact info below pricing */}
        <div className="mt-16 text-center">
          <p className="text-[#8E8EA0] text-sm">
            Punya pertanyaan spesifik? Hubungi kami di <a href="mailto:growfin.id@gmail.com" className="text-[#00e0b8] hover:underline">growfin.id@gmail.com</a>
          </p>
        </div>

      </div>
    </section>
  );
}
