import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LightFooter() {
  const { client } = useGroomingDemo();
  const logoName = client.name.split(' ')[0];

  return (
    <footer className="bg-charcoal-900 text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl mb-4">
          {logoName}<span className="text-brand-primary">.</span>
        </h2>
        <p className="text-sm text-white/70 font-light mb-8 max-w-md mx-auto">
          Mendefinisikan ulang kecantikan melalui karya seni tata rambut.
        </p>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} {client.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
