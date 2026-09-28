'use client';

import { useState } from 'react';
import { BusinessDemo } from '@/lib/types';
import { DynamicThemeProvider } from '../DynamicThemeProvider';
import { FnbDemoClient } from '../fnb-demo-client';
import { ServiceDemoClient } from '../service-demo-client';
import { GroomingDemoClient } from '../grooming-demo-client';
import { RetailDemoClient } from '../retail-demo-client';
import { OwnerToolbar } from './OwnerToolbar';
import { LiveEditorDrawer } from './LiveEditorDrawer';
import { CheckoutModal } from '../checkout/CheckoutModal';

interface DemoEditorWrapperProps {
  initialClient: BusinessDemo;
  initialLayout: string;
  templateType: 'fnb' | 'service' | 'retail' | 'grooming';
  slug: string;
}

export function DemoEditorWrapper({ initialClient, initialLayout, templateType, slug }: DemoEditorWrapperProps) {
  const [client, setClient] = useState<BusinessDemo>(initialClient);
  const [layoutVariant, setLayoutVariant] = useState(initialLayout);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Re-render the correct demo client based on template type
  let demoComponent;
  if (templateType === 'fnb') {
    demoComponent = <FnbDemoClient client={client} themeVariant={layoutVariant} />;
  } else if (templateType === 'service') {
    demoComponent = <ServiceDemoClient client={client} />;
  } else if (templateType === 'grooming') {
    demoComponent = <GroomingDemoClient client={client} themeVariant={layoutVariant} />;
  } else {
    demoComponent = <RetailDemoClient client={client} themeVariant={layoutVariant} />;
  }

  return (
    <DynamicThemeProvider themeColor={client.themeColor}>
      {demoComponent}
      
      {/* Editor Controls for Owner */}
      <OwnerToolbar 
        onEditClick={() => setIsEditorOpen(true)} 
        onPublishClick={() => setIsCheckoutOpen(true)} 
      />
      
      <LiveEditorDrawer 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        client={client} 
        onChange={setClient} 
        layoutVariant={layoutVariant}
        onLayoutChange={setLayoutVariant}
        templateType={templateType}
        slug={slug}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        slug={slug} 
      />
    </DynamicThemeProvider>
  );
}
