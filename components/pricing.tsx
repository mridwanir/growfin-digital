import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for new online businesses',
    price: 9999,
    period: 'one-time',
    features: [
      'Professional website (up to 5 pages)',
      'Mobile-responsive design',
      'Domain name (1 year)',
      'Professional email',
      'Basic contact form',
      'Google indexing',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing businesses needing more',
    price: 19999,
    period: 'one-time',
    featured: true,
    features: [
      'Everything in Starter',
      'Up to 15 pages',
      'E-commerce ready (product catalog)',
      'Advanced contact forms',
      'Appointment booking system',
      'Blog/news section',
      '3 months free support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Complete solution with ongoing support',
    price: 29999,
    period: 'one-time',
    features: [
      'Everything in Professional',
      'Unlimited pages',
      'Full e-commerce integration',
      'Payment gateway setup',
      'Email marketing integration',
      'CRM integration',
      '12 months premium support',
      'Monthly analytics reports',
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-slate-200 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Transparent Pricing
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            <span className="text-balance">Plans for every size of business</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            One-time setup fee. No hidden charges. No monthly surprises.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl transition-all ${
                plan.featured
                  ? 'border-2 border-emerald-600 bg-gradient-to-b from-emerald-50 to-white shadow-lg md:scale-105'
                  : 'border border-slate-200 bg-white'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">
                    ₹{(plan.price / 1000).toFixed(0)}K
                  </span>
                  <span className="text-sm text-slate-600">one-time</span>
                </div>

                <Button
                  className={`mt-8 w-full ${
                    plan.featured
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'border-slate-300 text-slate-900 hover:bg-slate-50'
                  }`}
                  variant={plan.featured ? 'default' : 'outline'}
                  size="lg"
                >
                  Get Started
                </Button>

                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">
            Not sure which plan? <span className="font-semibold text-slate-900">Talk to our team.</span> We&apos;ll
            recommend the perfect fit for your business.
          </p>
        </div>
      </div>
    </section>
  )
}
