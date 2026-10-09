const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'frontend/components/demo/fnb/themes');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith('SocialProof.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir(themesDir);

files.forEach(file => {
  const dir = path.dirname(file);
  const base = path.basename(file);
  const newName = base.replace('SocialProof', 'Reviews');
  const newFile = path.join(dir, newName);
  
  fs.renameSync(file, newFile);
  console.log(`Renamed ${base} to ${newName}`);
});
