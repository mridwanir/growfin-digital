'use client';

import { BusinessDemo } from '@/lib/types';
import { DefaultLayout } from './themes/default/DefaultLayout';
import { LumiereLayout } from './themes/lumiere/LumiereLayout';
import { BeautynspaProvider } from './core/BeautynspaContext';

export function BeautynspaRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  return (
    <BeautynspaProvider client={client}>
      {themeName === 'lumiere' ? <LumiereLayout client={client} /> : <DefaultLayout client={client} />}
    </BeautynspaProvider>
  );
}
