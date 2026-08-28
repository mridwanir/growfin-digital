import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="font-semibold text-slate-900">WebLaunch</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              How It Works
            </a>
            <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Benefits
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Pricing
            </a>
            <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Contact
            </a>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Get Started
            </Button>
          </div>

          <button className="md:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6 text-slate-900" />
          </button>
        </div>
      </div>
    </header>
  )
}
