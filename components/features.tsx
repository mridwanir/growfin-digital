import {
  Smartphone,
  Clock,
  BarChart3,
  Mail,
  Lock,
  Headphones,
} from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Beautiful on every device. Your customers browse on phones—we make sure they see your best side.',
  },
  {
    icon: Clock,
    title: 'Launch in 3 Days',
    description: 'Our team handles the setup. You focus on your business. Go live fast without weeks of waiting.',
  },
  {
    icon: BarChart3,
    title: 'See Your Traffic',
    description: 'Built-in analytics so you know who is visiting, where they are from, and what they are looking at.',
  },
  {
    icon: Mail,
    title: 'Lead Capture',
    description: 'Contact forms, inquiry buttons, and automated follow-ups. Never miss a potential customer.',
  },
  {
    icon: Lock,
    title: 'Secure & Compliant',
    description: 'SSL encryption, regular backups, and compliance with local data laws. Your data is protected.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Questions? Stuck? Our team is here to help—via chat, email, or phone whenever you need us.',
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-slate-200 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Everything You Need
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            <span className="text-balance">Built for small businesses, by people who understand them</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            All the tools you need to look professional, stay organized, and convert visitors into customers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
            >
              <feature.icon className="h-10 w-10 text-emerald-600 mb-4" />
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
