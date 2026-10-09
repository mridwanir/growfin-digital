const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix imports from old contexts that still somehow exist
      content = content.replace(/from\s+['"]\.\.\/core\/(ElectronicContext|GroceriesContext|ClothingContext)['"]/g, "from '../../core/RetailDemoContext'");
      content = content.replace(/from\s+['"]\.\.\/\.\.\/core\/(ElectronicContext|GroceriesContext|ClothingContext)['"]/g, "from '../../core/RetailDemoContext'");
      content = content.replace(/from\s+['"]\.\.\/\.\.\/\.\.\/core\/(ElectronicContext|GroceriesContext|ClothingContext)['"]/g, "from '../../../core/RetailDemoContext'");
      
      // Replace old placeholder image functions
      content = content.replace(/getElectronicPlaceholderImage/g, 'getRetailPlaceholderImage');
      content = content.replace(/getGroceryPlaceholderImage/g, 'getRetailPlaceholderImage');
      content = content.replace(/getClothingPlaceholderImage/g, 'getRetailPlaceholderImage');
      
      // Replace old hooks
      content = content.replace(/useFreshDemo/g, 'useRetailDemo');
      content = content.replace(/useClothingDemo/g, 'useRetailDemo');
      content = content.replace(/useElectronicDemo/g, 'useRetailDemo');
      content = content.replace(/useGroceriesDemo/g, 'useRetailDemo');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'frontend/components/demo/retail'));
console.log('Fixed imports in all retail files.');
