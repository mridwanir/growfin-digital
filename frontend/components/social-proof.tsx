'use client';
import { useLanguage } from '@/lib/language-context';

export function SocialProof() {
  const { language } = useLanguage();

  return (
    <section className="bg-[#0B0B0E] py-8 sm:py-12 relative z-10 border-t border-[#262633]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Context Label */}
          <p className="text-center text-[11px] font-semibold text-[#8E8EA0] uppercase tracking-widest">
            {language === 'en' ? 'Trusted by industry leaders' : 'Dipercaya oleh pemimpin industri'}
          </p>
          
          {/* Logo Bar */}
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            <img 
              src="/image/client/prov-jabar.png" 
              alt="Provinsi Jawa Barat" 
              className="h-12 md:h-14 object-contain brightness-0 invert opacity-50 transition-all duration-300 hover:opacity-100" 
            />
            <img 
              src="/image/client/bapenda.png" 
              alt="Bapenda" 
              className="h-10 md:h-12 object-contain brightness-0 invert opacity-50 transition-all duration-300 hover:opacity-100" 
            />
            <img 
              src="/image/client/sknc.png" 
              alt="SKNC" 
              className="h-8 md:h-10 object-contain brightness-0 invert opacity-50 transition-all duration-300 hover:opacity-100" 
            />
            <img 
              src="/image/client/kostkita.png" 
              alt="KostKita" 
              className="h-7 md:h-9 object-contain brightness-0 invert opacity-50 transition-all duration-300 hover:opacity-100" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

