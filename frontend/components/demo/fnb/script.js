const fs = require('fs');
const path = require('path');

const layouts = [
  'd:/Project/Growfin Digital/frontend/components/demo/fnb/restaurant/themes/default/PremiumLayout.tsx',
  'd:/Project/Growfin Digital/frontend/components/demo/fnb/restaurant/themes/artisan/ArtisanLayout.tsx',
  'd:/Project/Growfin Digital/frontend/components/demo/fnb/bakeryndessert/themes/default/DefaultLayout.tsx',
  'd:/Project/Growfin Digital/frontend/components/demo/fnb/fastfood/themes/default/DefaultLayout.tsx',
  'd:/Project/Growfin Digital/frontend/components/demo/fnb/bubleteanjuice/themes/default/DefaultLayout.tsx'
];

layouts.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('useFnbDemo')) {
    content = content.replace(/(import.*?;)/, $1\nimport { useFnbDemo } from '../../../core/FnbDemoContext';);
  }
  
  console.log('Processing:', file);
  // Just log to verify we can touch them
});
