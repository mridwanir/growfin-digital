const fs = require('fs');
const path = require('path');
const dir = 'd:/Project/Growfin Digital/frontend/components/demo/retail/themes';

function processDir(currentDir) {
  fs.readdirSync(currentDir).forEach(file => {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // If the file uses `client.` but doesn't extract it
      if (content.includes('client.') && !content.includes('const { client }') && !content.includes('client: BusinessDemo')) {
        let changed = false;
        
        if (!content.includes('useRetailDemo')) {
          content = content.replace(/'use client';\r?\n/, "'use client';\n\nimport { useRetailDemo } from '../../core/RetailDemoContext';\n");
          changed = true;
        }
        
        // Find the export function line
        const funcRegex = /export function \w+\([^)]*\) {\r?\n/;
        const match = content.match(funcRegex);
        if (match) {
          content = content.replace(match[0], match[0] + "  const { client } = useRetailDemo();\n");
          changed = true;
        }

        if (changed) {
          fs.writeFileSync(fullPath, content);
          console.log('Added missing client hook in ' + file);
        }
      }
    }
  });
}

processDir(dir);
