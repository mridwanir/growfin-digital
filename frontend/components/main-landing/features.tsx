'use client';
export function Features() {
    return (
        <section id="layanan" className="py-20 bg-soft">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-extrabold text-dark mb-4">Kenapa <span className="text-emerald">Growfin?</span></h2>
                    <p className="text-slate-500 font-medium">Platform all-in-one yang bawa bisnis kamu terbang to next level tanpa ribet.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-[2rem] p-8 text-center hover-lift border border-slate-100">
                        <img src="/image/landing/icon/website-instant.png" alt="Website Instan" className="w-24 h-24 mx-auto mb-6 object-contain drop-shadow-md" />
                        <h3 className="text-lg font-bold text-dark mb-3">Website Instan</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Sistem kita bantu ngeracik website responsif kilat. Isi form, langsung jadi!</p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-8 text-center hover-lift border border-slate-100">
                        <img src="/image/landing/icon/live-dashboard.png" alt="Live Dashboard" className="w-24 h-24 mx-auto mb-6 object-contain drop-shadow-md" />
                        <h3 className="text-lg font-bold text-dark mb-3">Live Dashboard</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Kelola menu, harga, galeri, dan tampilan website secara mandiri tanpa perlu paham coding sama sekali.</p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-8 text-center hover-lift border border-slate-100">
                        <img src="/image/landing/icon/custom-domain.png" alt="Custom Domain" className="w-24 h-24 mx-auto mb-6 object-contain drop-shadow-md" />
                        <h3 className="text-lg font-bold text-dark mb-3">Custom Domain</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Branding makin kuat dan terpercaya pake domain .com pilihan u sendiri.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
