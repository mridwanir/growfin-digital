import { ClassicLayout } from './themes/default/ClassicLayout';
import { AlternatifLayout } from './themes/alternatif/AlternatifLayout';

export function CafeRouter({ themeName }: { themeName: string }) {
  if (themeName === 'alternatif') {
    return <AlternatifLayout />;
  }
  
  // fallback to default (classic)
  return <ClassicLayout />;
}
