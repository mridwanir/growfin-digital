'use client';

export function SocialProof() {
  const logos = Array.from({ length: 13 }, (_, i) => `/image/landing/company/fake-company (${i + 1}).png`);

  return (
    <section className="bg-white py-8 sm:py-12 relative z-10 border-b border-slate-100 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto mb-6">
        <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Dipercaya oleh UMKM dan instansi pemimpin industri
        </p>
      </div>

      <div className="relative flex overflow-hidden w-full group py-4">
        <div className="flex w-max animate-marquee space-x-12 px-6 items-center">
          {logos.concat(logos).map((logo, idx) => (
            <img key={idx} src={logo} alt={`Client Logo ${idx}`} className="h-8 sm:h-10 object-contain grayscale opacity-40 transition-all duration-300 hover:grayscale-0 hover:opacity-100 shrink-0" />
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
