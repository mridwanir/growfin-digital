import { ArrowRight } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-[#0B0B0E] relative overflow-hidden border-y border-[#262633]">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          
          {/* Level 1 - Category Tag / Pill Badge */}
          <div className="inline-flex items-center rounded-full bg-[#00b894]/10 border border-[#00b894]/20 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#00e0b8] shadow-sm">
            Our Mission
          </div>

          {/* Level 2 - Large Display Copy */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            <span className="text-[#8E8EA0]">Empowering </span>
            <span className="text-[#FFFFFF]">Local Businesses </span>
            <br className="hidden md:block" />
            <span className="text-[#8E8EA0]">With </span>
            <span className="text-[#FFFFFF]">Instant Digital </span>
            <span className="text-[#8E8EA0]">Transformation.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-[#8E8EA0] max-w-2xl mx-auto font-medium">
            Growfin Digital democratizes high-end technology. Whether you need a ready-to-deploy website template in 24 hours or a fully custom scalable application, we are your long-term growth partner.
          </p>

          {/* Level 3 - Secondary Action Button */}
          <div className="pt-4">
            <a 
              href="#team"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#14141A] hover:bg-[#262633] text-[#FFFFFF] text-xs font-bold rounded-full border border-[#262633] shadow-sm transition-colors group"
            >
              <span>Explore Our Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00e0b8] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
        
      </div>
    </section>
  );
}
