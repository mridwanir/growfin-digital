const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend/components/demo/retail');
const themesDir = path.join(baseDir, 'themes');

if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir);
}

const mapping = [
  { 
    oldPath: 'clothing/themes/default', 
    newName: 'urban', 
    renames: {
      'DefaultLayout.tsx': 'UrbanLayout.tsx',
      'RetailHeroScreen.tsx': 'UrbanHero.tsx',
      'RetailProductList.tsx': 'UrbanProductGrid.tsx',
      'RetailSocialProof.tsx': 'UrbanReviews.tsx',
      'RetailFAQ.tsx': 'UrbanFAQ.tsx'
    }
  },
  { 
    oldPath: 'clothing/themes/editorial', 
    newName: 'editorial', 
    renames: {
      'EditorialNavbar.tsx': 'EditorialHeader.tsx',
      'EditorialShop.tsx': 'EditorialProductGrid.tsx',
      'EditorialTestimonial.tsx': 'EditorialReviews.tsx'
    }
  },
  { 
    oldPath: 'electronic/themes/default', 
    newName: 'tech', 
    prefixOld: 'Electronic',
    prefixNew: 'Tech',
    renames: {
      'ElectronicDefaultLayout.tsx': 'TechLayout.tsx'
    }
  },
  { 
    oldPath: 'electronic/themes/dark', 
    newName: 'dark', 
    prefixOld: 'ElectronicDark',
    prefixNew: 'Dark'
  },
  { 
    oldPath: 'groceries/themes/default', 
    newName: 'fresh', 
    prefixOld: 'Groceries',
    prefixNew: 'Fresh',
    renames: {
      'DefaultLayout.tsx': 'FreshLayout.tsx'
    }
  },
  { 
    oldPath: 'groceries/themes/artisan', 
    newName: 'artisan', 
    prefixOld: 'Artisan',
    prefixNew: 'Artisan'
  }
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
      
      // Explicit renames first
      if (m.renames && m.renames[file]) {
        newFile = m.renames[file];
      } else if (m.prefixOld && m.prefixNew && file.startsWith(m.prefixOld)) {
        // Prefix renames
        newFile = file.replace(m.prefixOld, m.prefixNew);
      }

      if (file !== newFile) {
        fs.renameSync(path.join(targetPath, file), path.join(targetPath, newFile));
        console.log(`Renamed ${file} to ${newFile}`);
      }
    });

    // Second pass: Replace content in all files
    const newFiles = fs.readdirSync(targetPath);
    newFiles.forEach(file => {
      if (!file.endsWith('.tsx')) return;
      
      let content = fs.readFileSync(path.join(targetPath, file), 'utf8');
      
      // Replace file names and export names
      if (m.renames) {
        Object.entries(m.renames).forEach(([oldN, newN]) => {
          const oldName = oldN.replace('.tsx', '');
          const newName = newN.replace('.tsx', '');
          content = content.replace(new RegExp(oldName, 'g'), newName);
        });
      }
      
      if (m.prefixOld && m.prefixNew && m.prefixOld !== m.prefixNew) {
        content = content.replace(new RegExp(m.prefixOld, 'g'), m.prefixNew);
      }
      
      // Fix context imports
      content = content.replace(/\.\.\/\.\.\/core\/[A-Za-z]+Context/g, '../../core/RetailDemoContext');
      content = content.replace(/useClothingDemo|useElectronicDemo|useGroceriesDemo/g, 'useRetailDemo');

      // Unify components that might be using Retail/Editorial/Groceries specific
      // We will also unify 'RetailSocialProof' -> 'UrbanReviews', etc that were explicitly renamed
      
      fs.writeFileSync(path.join(targetPath, file), content);
    });
  }
});

console.log('Fase 1 Selesai: Restrukturisasi Direktori & Penamaan File Berhasil!');
