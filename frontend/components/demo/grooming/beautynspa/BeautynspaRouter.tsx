'use client';

import { BusinessDemo } from '@/lib/types';
import { DefaultLayout } from './themes/default/DefaultLayout';
import { LumiereLayout } from './themes/lumiere/LumiereLayout';
import { DayspaLayout } from './themes/dayspa/DayspaLayout';
export function BeautynspaRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  return (
    <>
      {themeName === 'lumiere' ? <LumiereLayout /> : themeName === 'dayspa' ? <DayspaLayout /> : <DefaultLayout />}
    </>
  );
}
