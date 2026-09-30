import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BarbershopFooter() {
  const { client } = useGroomingDemo();
  const logoName = client.name.split(' ')[0].toUpperCase();

  return (
    <footer className="bg-vintage-900 border-t border-vintage-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl mb-4 text-brand-primary tracking-widest uppercase">{logoName}.</h2>
        <p className="text-sm text-paper/60 font-serif italic mb-8">Forging confidence through classic grooming.</p>
        <p className="text-xs text-paper/40 font-display tracking-widest uppercase">
          © {new Date().getFullYear()} {client.name.toUpperCase()}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
