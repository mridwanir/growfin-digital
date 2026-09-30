'use client';

import { BusinessDemo } from '@/lib/types';
import { DefaultLayout } from './themes/default/DefaultLayout';
import { LightLayout } from './themes/light/LightLayout';
export function BarbershopRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  return (
    <>
      {themeName === 'light' ? <LightLayout /> : <DefaultLayout />}
    </>
  );
}
