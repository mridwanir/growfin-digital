const fs = require('fs');
const path = require('path');

const targetDir = 'd:/Project/Growfin Digital/frontend/components/demo';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replacements
  content = content.replace(/\{activeTheme\.textAccent\}/g, '"text-brand-primary"');
  content = content.replace(/activeTheme=\{activeTheme\}/g, '');
  content = content.replace(/const activeTheme = THEMES\[currentTheme\];/g, '');
  content = content.replace(/activeTheme:\s*ThemeConfig;/g, '');
  content = content.replace(/activeTheme:\s*any;/g, '');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(targetDir);
console.log('Done fixing activeTheme!');
