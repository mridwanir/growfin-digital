const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend/components/demo/fnb');
const themesDir = path.join(baseDir, 'themes');

if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir);
}

const mapping = [
  { oldPath: 'cafe/themes/default', newName: 'classic', prefixOld: 'Fnb', prefixNew: 'Classic' },
  { oldPath: 'cafe/themes/alternatif', newName: 'modern', prefixOld: 'Alternatif', prefixNew: 'Modern' },
  { oldPath: 'restaurant/themes/default', newName: 'premium', prefixOld: 'Premium', prefixNew: 'Premium' },
  { oldPath: 'restaurant/themes/artisan', newName: 'artisan', prefixOld: 'Artisan', prefixNew: 'Artisan' },
  { oldPath: 'bakeryndessert/themes/default', newName: 'elegant', prefixOld: 'Bakery', prefixNew: 'Elegant' },
  { oldPath: 'fastfood/themes/default', newName: 'bold', prefixOld: 'Fastfood', prefixNew: 'Bold' },
  { oldPath: 'bubleteanjuice/themes/default', newName: 'vibrant', prefixOld: 'Bubbletea', prefixNew: 'Vibrant' }
];

mapping.forEach(m => {
  const sourcePath = path.join(baseDir, m.oldPath);
  const targetPath = path.join(themesDir, m.newName);

  if (fs.existsSync(sourcePath)) {
    // move directory
    fs.renameSync(sourcePath, targetPath);
    console.log(`Moved ${m.oldPath} to themes/${m.newName}`);

    // rename files inside
    const files = fs.readdirSync(targetPath);
    files.forEach(file => {
      let newFile = file;
      if (file === 'DefaultLayout.tsx') {
        newFile = `${m.prefixNew}Layout.tsx`;
      } else if (file.startsWith(m.prefixOld)) {
        newFile = file.replace(m.prefixOld, m.prefixNew);
      } else if (m.prefixOld === 'Fnb' && file.includes('SocialProof')) {
        newFile = file.replace('Fnb', 'Classic');
      }
      
      // Some specific adjustments
      if (newFile === 'ClassicSocialProof.tsx') newFile = 'ClassicReviews.tsx';
      if (newFile === 'ModernSocialProof.tsx') newFile = 'ModernReviews.tsx';

      if (file !== newFile) {
        fs.renameSync(path.join(targetPath, file), path.join(targetPath, newFile));
        console.log(`Renamed ${file} to ${newFile}`);
      }

      // Read file and replace content
      let content = fs.readFileSync(path.join(targetPath, newFile), 'utf8');
      
      // Replace FnbHeader -> ClassicHeader, etc.
      // Also DefaultLayout -> ClassicLayout
      content = content.replace(new RegExp(`DefaultLayout`, 'g'), `${m.prefixNew}Layout`);
      content = content.replace(new RegExp(`${m.prefixOld}Header`, 'g'), `${m.prefixNew}Header`);
      content = content.replace(new RegExp(`${m.prefixOld}Menu`, 'g'), `${m.prefixNew}Menu`);
      content = content.replace(new RegExp(`${m.prefixOld}Gallery`, 'g'), `${m.prefixNew}Gallery`);
      content = content.replace(new RegExp(`${m.prefixOld}Lookbook`, 'g'), `${m.prefixNew}Lookbook`); // For fastfood/boba which had Lookbook instead of Gallery
      content = content.replace(new RegExp(`${m.prefixOld}Reviews`, 'g'), `${m.prefixNew}Reviews`);
      content = content.replace(new RegExp(`${m.prefixOld}SocialProof`, 'g'), `${m.prefixNew}Reviews`); // Classic/Modern had SocialProof
      content = content.replace(new RegExp(`${m.prefixOld}Contact`, 'g'), `${m.prefixNew}Contact`);
      content = content.replace(new RegExp(`${m.prefixOld}Footer`, 'g'), `${m.prefixNew}Footer`);

      // Special cases
      if (m.newName === 'classic') {
        content = content.replace(/FnbSocialProof/g, 'ClassicReviews');
        content = content.replace(/FnbHeader/g, 'ClassicHeader');
        content = content.replace(/FnbMenu/g, 'ClassicMenu');
        content = content.replace(/FnbGallery/g, 'ClassicGallery');
        content = content.replace(/FnbContact/g, 'ClassicContact');
        content = content.replace(/FnbFooter/g, 'ClassicFooter');
      }
      if (m.newName === 'modern') {
        content = content.replace(/AlternatifSocialProof/g, 'ModernReviews');
      }

      // Rename import files (since we renamed them)
      content = content.replace(/'\.\/FnbHeader'/g, "'./ClassicHeader'");
      content = content.replace(/'\.\/FnbMenu'/g, "'./ClassicMenu'");
      content = content.replace(/'\.\/FnbGallery'/g, "'./ClassicGallery'");
      content = content.replace(/'\.\/FnbSocialProof'/g, "'./ClassicReviews'");
      content = content.replace(/'\.\/FnbContact'/g, "'./ClassicContact'");
      content = content.replace(/'\.\/FnbFooter'/g, "'./ClassicFooter'");

      content = content.replace(/'\.\/AlternatifSocialProof'/g, "'./ModernReviews'");

      content = content.replace(new RegExp(`'\\./${m.prefixOld}Lookbook'`, 'g'), `'./${m.prefixNew}Lookbook'`); // FastfoodLookbook -> BoldLookbook

      fs.writeFileSync(path.join(targetPath, newFile), content);
    });
  }
});
