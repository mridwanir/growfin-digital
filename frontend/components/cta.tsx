import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section id="contact" className="border-t border-slate-200 bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          <span className="text-balance">Ready to go online? Let&apos;s make it happen.</span>
        </h2>
        <p className="mt-4 text-lg text-emerald-100">
          Schedule a free 20-minute consultation with our team. No obligation. Just honest advice about what your
          business needs.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <Button
            size="lg"
            className="bg-white text-emerald-700 hover:bg-slate-50 font-semibold"
          >
            Book a Free Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white border-white hover:bg-white/10"
          >
            Call: +1-800-WEBLAUNCH
          </Button>
        </div>

        <p className="mt-6 text-sm text-emerald-100">
          Trusted by 250+ businesses. 4.9/5 average rating.
        </p>
      </div>
    </section>
  )
}
