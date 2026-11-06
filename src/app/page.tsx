import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Growfin Digital</h1>
          <p className="text-muted-foreground text-sm">
            Platform SaaS & AI Generator UMKM Indonesia. Clean-slate Next.js 16 App Shell.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="default">Mulai Sekarang</Button>
          <Button variant="outline">Pelajari Fitur</Button>
        </div>
      </div>
    </main>
  )
}
