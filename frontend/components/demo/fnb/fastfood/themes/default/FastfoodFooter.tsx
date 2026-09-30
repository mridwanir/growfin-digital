import { useFnbDemo } from '../../../core/FnbDemoContext';

export function FastfoodFooter() {
  const { client } = useFnbDemo();
  const brandInitial = client.name ? client.name.charAt(0).toUpperCase() : 'C';

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-primary text-white font-bold flex items-center justify-center">{brandInitial}</div>
          <span className="text-white font-extrabold tracking-tight uppercase">{client.name} KITCHEN</span>
        </div>
        <p className="text-neutral-500 text-xs text-center md:text-right">
          © {new Date().getFullYear()} {client.name} Fast Food Co. Standard HACCP & Halal Certified Kitchens.
        </p>
      </div>
    </footer>
  );
}
