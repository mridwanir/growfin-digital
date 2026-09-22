import { ArrowRight, Network } from 'lucide-react';

export function CTA() {
  return (
    <section id="contact" className="bg-[#0B0B0E] py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#262633]">
      <div className="mx-auto max-w-6xl">
        
        {/* Background Gradient & Card Structure */}
        <div className="relative rounded-[32px] sm:rounded-[48px] bg-gradient-to-r from-[#00b894] to-[#00e0b8] overflow-hidden shadow-2xl">
          
          {/* Subtle Illustration / Watermark (Right Side) */}
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none hidden md:block">
            {/* Using a Lucide icon heavily scaled up as a background watermark */}
            <Network className="absolute right-[-10%] top-[-20%] w-full h-[140%] text-white" strokeWidth={0.5} />
          </div>

          <div className="relative z-10 px-8 py-16 md:p-20 lg:p-24 max-w-3xl text-left">
            
            {/* Kategori Badge */}
            <div className="inline-flex items-center rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-xs font-bold text-white shadow-sm mb-8 backdrop-blur-sm">
              Try it now
            </div>

            {/* Display Headline (H2) */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Ready to Accelerate <br className="hidden md:block" /> Your Growth?
            </h2>

            {/* Value Proposition Body */}
            <p className="text-lg md:text-xl text-white/90 font-medium mb-10 max-w-xl leading-relaxed">
              Join hundreds of innovative businesses scaling their operations with our custom engineering and intelligent AI automation platform. Seamless implementation in minutes.
            </p>

            {/* Dual-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              
              {/* Primary CTA */}
              <a
                href="#"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-[#0B0B0E] text-sm font-black rounded-full transition-colors active:scale-95 shadow-lg"
              >
                <span>Get Started - Free</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Secondary CTA */}
              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/40 hover:bg-white/10 hover:border-white text-white text-sm font-bold rounded-full transition-all active:scale-95"
              >
                View Pricing
              </a>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
