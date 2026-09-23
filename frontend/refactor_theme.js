const fs = require('fs');
const path = require('path');

const targetDir = 'd:/Project/Growfin Digital/frontend/components/demo';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replacements
  content = content.replace(/\$\{activeTheme\.gradientHeader\}/g, 'from-brand-primary to-brand-dark');
  content = content.replace(/\$\{activeTheme\.primaryBg\} \$\{activeTheme\.primaryHoverBg\}/g, 'bg-brand-primary hover:bg-brand-hover');
  content = content.replace(/\$\{activeTheme\.primaryBg\}/g, 'bg-brand-primary');
  content = content.replace(/hover:\$\{activeTheme\.textAccent\}/g, 'hover:text-brand-primary');
  content = content.replace(/\$\{activeTheme\.textAccent\}/g, 'text-brand-primary');
  content = content.replace(/\$\{activeTheme\.lightBg\}/g, 'bg-brand-light');
  content = content.replace(/\$\{activeTheme\.borderColor\}/g, 'border-brand-primary/30');
  content = content.replace(/\$\{activeTheme\.cardActiveBorder\}/g, 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-light');
  content = content.replace(/\$\{activeTheme\.badgeStyle\}/g, 'bg-brand-light text-brand-primary border-brand-primary/20');
  content = content.replace(/\$\{activeTheme\.shadowGlow\}/g, 'shadow-brand-primary/25');
  content = content.replace(/\$\{activeTheme\.ringColor\}/g, 'ring-brand-primary/20');

  // Also remove unused activeTheme destructuring
  content = content.replace(/const\s*{\s*([^}]*?),\s*activeTheme\s*,\s*([^}]*?)\s*}\s*=\s*use(Clinic|Cafe)Demo\(\);/g, 'const { $1, $2 } = use$3Demo();');
  content = content.replace(/const\s*{\s*activeTheme\s*,\s*([^}]*?)\s*}\s*=\s*use(Clinic|Cafe)Demo\(\);/g, 'const { $1 } = use$2Demo();');
  content = content.replace(/const\s*{\s*([^}]*?),\s*activeTheme\s*}\s*=\s*use(Clinic|Cafe)Demo\(\);/g, 'const { $1 } = use$2Demo();');
  content = content.replace(/const\s*{\s*activeTheme\s*}\s*=\s*use(Clinic|Cafe)Demo\(\);/g, ''); // empty destructure!
  content = content.replace(/,\s*activeTheme/g, '');
  content = content.replace(/activeTheme,\s*/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated:', filePath);
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
console.log('Done refactoring semantic classes!');
