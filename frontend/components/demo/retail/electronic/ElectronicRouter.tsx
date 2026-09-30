'use client';

import { BusinessDemo } from '@/lib/types';
import { ElectronicProvider } from './core/ElectronicContext';
import { ElectronicDefaultLayout } from './themes/default/ElectronicDefaultLayout';
import { ElectronicDarkLayout } from './themes/dark/ElectronicDarkLayout';

export function ElectronicRouter({ client, themeName }: { client: BusinessDemo, themeName?: string }) {
  const renderLayout = () => {
    if (themeName === 'retail-electronic-dark' || themeName === 'dark') {
      return <ElectronicDarkLayout client={client} />;
    }
    return <ElectronicDefaultLayout client={client} />;
  };

  return (
    <ElectronicProvider client={client}>
      {renderLayout()}
    </ElectronicProvider>
  );
}
