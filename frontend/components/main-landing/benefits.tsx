import { Check } from 'lucide-react'

export function Benefits() {
  return (
    <section id="benefits" className="bg-slate-50 py-20 sm:py-28 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Why Choose Us
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                <span className="text-balance">More than a website—a growth partner</span>
              </h2>
            </div>
            <p className="text-lg text-slate-600">
              We&apos;ve helped hundreds of MSMEs go from invisible to indispensable. Our clients report a 3x increase
              in customer inquiries within their first month online.
            </p>

            <ul className="space-y-4">
              {[
                'Domain name + professional email included',
                'Custom design tailored to your industry',
                'Optimized for search engines (Google ranking)',
                'Payment integration ready (optional)',
                'Monthly maintenance and updates',
                'Ownership remains completely yours',
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 text-3xl font-bold text-emerald-600">3x</div>
                <p className="text-sm font-medium text-slate-900">increase in customer inquiries</p>
                <p className="mt-1 text-xs text-slate-600">on average, first month</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 text-3xl font-bold text-emerald-600">48 hrs</div>
                <p className="text-sm font-medium text-slate-900">average setup time</p>
                <p className="mt-1 text-xs text-slate-600">from onboarding to launch</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 text-3xl font-bold text-emerald-600">250+</div>
                <p className="text-sm font-medium text-slate-900">websites launched</p>
                <p className="mt-1 text-xs text-slate-600">still growing daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
