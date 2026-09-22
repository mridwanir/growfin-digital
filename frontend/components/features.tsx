import { Code2, Bot, Cloud, TrendingUp } from 'lucide-react';

export function Features() {
  return (
    <section id="services" className="py-24 bg-[#0B0B0E] border-t border-[#262633]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#00e0b8] bg-[#00b894]/10 px-3 py-1 rounded-full border border-[#00b894]/20">
            End-To-End Solutions
          </span>
          <h2 className="text-3xl font-black text-[#FFFFFF] sm:text-5xl tracking-tight">
            From Templates to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b894] to-[#00e0b8]">Custom Apps</span>
          </h2>
          <p className="text-sm sm:text-lg text-[#8E8EA0] leading-relaxed font-medium">
            Everything you need to go digital instantly, or build complex enterprise systems from scratch as your business grows.
          </p>
        </div>

        {/* Bento Grid 2x2 */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          
          {/* Card 1 */}
          <div className="group relative rounded-3xl bg-[#14141A] border border-[#262633] overflow-hidden flex flex-col justify-between hover:border-[#00b894]/50 transition-colors">
            {/* Feature Header */}
            <div className="p-8 pb-0 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b894]/10 border border-[#00b894]/20 text-[#00e0b8]">
                  <Code2 className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#FFFFFF]">Instant Business Templates</h3>
              </div>
              <p className="text-sm text-[#8E8EA0] leading-relaxed">
                Generate and launch a premium, mobile-ready website for your business in under 24 hours. Go live instantly.
              </p>
            </div>
            {/* Interactive Mockup */}
            <div className="mt-8 p-6 pt-0 relative">
              <div className="w-full h-40 bg-[#0B0B0E] rounded-2xl border border-[#262633] p-4 flex flex-col justify-end relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(112,66,244,0.1)] transition-shadow">
                {/* Simulated IDE / Code Editor */}
                <div className="absolute top-0 left-0 w-full h-8 bg-[#1A1A24] border-b border-[#262633] flex items-center px-4 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#262633]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#262633]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#262633]"></div>
                </div>
                <div className="mt-6 font-mono text-[10px] text-[#8E8EA0] space-y-1">
                  <p><span className="text-[#00e0b8]">import</span> {'{'} Growfin {'}'} <span className="text-[#00e0b8]">from</span> '@core';</p>
                  <p className="pt-2"><span className="text-[#00b894]">Growfin</span>.initialize({'{'}</p>
                  <p className="pl-4">mode: <span className="text-emerald-400">'production'</span>,</p>
                  <p className="pl-4">scale: <span className="text-[#00e0b8]">true</span></p>
                  <p>{'}'});</p>
                </div>
                <div className="absolute bottom-0 right-0 p-4">
                  <div className="px-3 py-1 bg-[#00b894] rounded text-[10px] text-[#FFFFFF] font-bold shadow-lg animate-pulse">Running</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-3xl bg-[#14141A] border border-[#262633] overflow-hidden flex flex-col justify-between hover:border-[#00b894]/50 transition-colors">
            {/* Feature Header */}
            <div className="p-8 pb-0 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b894]/10 border border-[#00b894]/20 text-[#00e0b8]">
                  <Bot className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#FFFFFF]">AI Workflow Automation</h3>
              </div>
              <p className="text-sm text-[#8E8EA0] leading-relaxed">
                Upgrade your business with custom AI models to automate repetitive tasks, answer customer queries, and generate leads 24/7.
              </p>
            </div>
            {/* Interactive Mockup */}
            <div className="mt-8 p-6 pt-0 relative">
              <div className="w-full h-40 bg-[#0B0B0E] rounded-2xl border border-[#262633] p-4 flex flex-col justify-center items-center relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(112,66,244,0.1)] transition-shadow">
                {/* AI Node visualization */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00b894]/20 blur-3xl rounded-full" />
                <div className="relative z-10 flex items-center justify-center gap-4 w-full">
                  <div className="h-10 w-10 bg-[#1A1A24] border border-[#262633] rounded-lg flex flex-col items-center justify-center gap-1">
                    <div className="w-4 h-1 bg-[#8E8EA0] rounded-full"></div>
                    <div className="w-4 h-1 bg-[#8E8EA0] rounded-full"></div>
                  </div>
                  {/* Glowing Connection Line */}
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-[#262633] via-[#00e0b8] to-[#262633] relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#00b894] rounded-full shadow-[0_0_10px_#00e0b8] animate-ping"></div>
                  </div>
                  <div className="h-10 w-10 bg-[#00b894]/10 border border-[#00b894] rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#00e0b8]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-3xl bg-[#14141A] border border-[#262633] overflow-hidden flex flex-col justify-between hover:border-[#00b894]/50 transition-colors">
            {/* Feature Header */}
            <div className="p-8 pb-0 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b894]/10 border border-[#00b894]/20 text-[#00e0b8]">
                  <Cloud className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#FFFFFF]">Enterprise Architecture</h3>
              </div>
              <p className="text-sm text-[#8E8EA0] leading-relaxed">
                For large-scale operations, we build secure, microservices-based cloud systems from scratch tailored to your complex needs.
              </p>
            </div>
            {/* Interactive Mockup */}
            <div className="mt-8 p-6 pt-0 relative">
              <div className="w-full h-40 bg-[#0B0B0E] rounded-2xl border border-[#262633] p-4 flex flex-col justify-center gap-3 relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(112,66,244,0.1)] transition-shadow">
                {/* Server Rack Simulation */}
                <div className="w-full h-8 bg-[#1A1A24] border border-[#262633] rounded-md flex items-center justify-between px-4">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="w-1/2 h-1 bg-[#262633] rounded-full"></div>
                </div>
                <div className="w-full h-8 bg-[#1A1A24] border border-[#00b894]/50 rounded-md flex items-center justify-between px-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#00b894]/10"></div>
                  <div className="flex gap-2 relative z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00e0b8] animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00e0b8] animate-pulse"></div>
                  </div>
                  <div className="w-1/2 h-1 bg-[#00b894]/30 rounded-full relative z-10">
                    <div className="w-3/4 h-full bg-[#00b894] rounded-full"></div>
                  </div>
                </div>
                <div className="w-full h-8 bg-[#1A1A24] border border-[#262633] rounded-md flex items-center justify-between px-4">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#262633]"></div>
                  </div>
                  <div className="w-1/2 h-1 bg-[#262633] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group relative rounded-3xl bg-[#14141A] border border-[#262633] overflow-hidden flex flex-col justify-between hover:border-[#00b894]/50 transition-colors">
            {/* Feature Header */}
            <div className="p-8 pb-0 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b894]/10 border border-[#00b894]/20 text-[#00e0b8]">
                  <TrendingUp className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#FFFFFF]">Custom Pro Features</h3>
              </div>
              <p className="text-sm text-[#8E8EA0] leading-relaxed">
                Need more than a template? We seamlessly integrate custom payment gateways, booking systems, and data analytics dashboards.
              </p>
            </div>
            {/* Interactive Mockup */}
            <div className="mt-8 p-6 pt-0 relative">
              <div className="w-full h-40 bg-[#0B0B0E] rounded-2xl border border-[#262633] p-4 flex items-end justify-between gap-2 relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(112,66,244,0.1)] transition-shadow">
                {/* Bar Chart Simulation */}
                <div className="w-full h-[40%] bg-[#1A1A24] rounded-t-sm"></div>
                <div className="w-full h-[60%] bg-[#1A1A24] rounded-t-sm"></div>
                <div className="w-full h-[35%] bg-[#1A1A24] rounded-t-sm"></div>
                <div className="w-full h-[75%] bg-[#00b894]/40 rounded-t-sm relative border-t border-[#00b894]">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00b894] text-[#FFFFFF] text-[9px] font-bold px-2 py-0.5 rounded">
                    +74%
                  </div>
                </div>
                <div className="w-full h-[50%] bg-[#1A1A24] rounded-t-sm"></div>
                <div className="w-full h-[90%] bg-[#1A1A24] rounded-t-sm"></div>
                
                {/* Trend Line Overlay */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path d="M 0 120 Q 50 100 100 80 T 200 40 T 300 10" fill="none" stroke="#00e0b8" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
