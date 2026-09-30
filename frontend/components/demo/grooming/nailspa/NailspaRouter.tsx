import { BusinessDemo } from '@/lib/types';
import { DefaultLayout } from './themes/default/DefaultLayout';
export function NailspaRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  return (
    <>
      <DefaultLayout />
    </>
  );
}
