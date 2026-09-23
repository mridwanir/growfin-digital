'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ClinicPractitionerList() {
  const { client } = useClinicDemo();

  // If no practitioners are provided, we don't render this section
  if (!client.practitioners || client.practitioners.length === 0) return null;

  return (
    <section id="praktisi" className="space-y-10 scroll-mt-24 mb-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          Tim Profesional <span className="text-brand-primary">Kami</span>
        </h2>
        <p className="text-slate-500 font-medium">
          Ditangani langsung oleh para ahli tersertifikasi dengan jam terbang tinggi di bidangnya.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {client.practitioners.map((practitioner, idx) => (
          <PractitionerCard key={practitioner.id} practitioner={practitioner} index={idx} />
        ))}
      </div>
    </section>
  );
}

function PractitionerCard({ practitioner, index }: { practitioner: any, index: number }) {
  const delay = (index % 3) * 100;
  const { ref, isVisible } = useScrollReveal(0.1, delay);

  // Parse today's schedule roughly (Mock logic)
  const isPracticingToday = Math.random() > 0.3; // 70% chance practicing today for demo purposes
  const todaySchedule = isPracticingToday ? '16.00 - 20.00' : 'Tidak ada jadwal hari ini';

  return (
    <div 
      ref={ref}
      className={`bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-brand-light flex items-center justify-center text-5xl shadow-inner border-4 border-white">
            {practitioner.avatarEmoji || '🧑‍⚕️'}
          </div>
          {/* Status Dot */}
          <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${isPracticingToday ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
        </div>

        {/* Info */}
        <h3 className="text-xl font-black text-slate-900 mb-1">{practitioner.name}</h3>
        <p className="text-brand-primary font-bold text-sm mb-3">{practitioner.role}</p>
        
        {practitioner.licenseNumber && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 mb-6">
            <span className="text-slate-400">🛡️</span>
            {practitioner.licenseNumber}
          </div>
        )}

        {/* Schedule */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 text-left border border-slate-100">
          <p className="text-xs font-bold text-slate-400 mb-1">Praktik Hari Ini</p>
          <p className={`text-sm font-black ${isPracticingToday ? 'text-slate-800' : 'text-slate-400'}`}>
            {todaySchedule}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-200/60">
            <p className="text-xs font-bold text-slate-400 mb-1">Jadwal Reguler</p>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              {practitioner.schedule || 'Senin - Jumat, Hubungi untuk info detail'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
