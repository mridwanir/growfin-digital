import { Button } from '@/components/ui/button'
import { ArrowRight, Globe, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                For Small Businesses
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                <span className="text-balance">
                  Your Official Website,{' '}
                  <span className="text-emerald-600">Built in Days</span>
                </span>
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              Stop leaving customers guessing. Get a professional, fast-loading website that
              builds trust and brings customers through the door.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300">
                See Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Launch in 3 Days</p>
                  <p className="text-xs text-slate-600">No coding required</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">SEO Ready</p>
                  <p className="text-xs text-slate-600">Found on Google</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-8">
              <div className="h-full rounded-xl bg-white shadow-lg flex items-center justify-center">
                <div className="space-y-3 w-full px-6">
                  <div className="h-3 w-24 rounded bg-emerald-200" />
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-slate-100" />
                    <div className="h-2 w-5/6 rounded bg-slate-100" />
                    <div className="h-2 w-4/5 rounded bg-slate-100" />
                  </div>
                  <div className="pt-4">
                    <div className="h-2 w-32 rounded bg-emerald-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
