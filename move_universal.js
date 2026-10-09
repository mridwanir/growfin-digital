const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend/components/demo/retail');
const universalDir = path.join(baseDir, 'universal');

if (!fs.existsSync(universalDir)) {
  fs.mkdirSync(universalDir);
}

const moves = [
  { old: 'clothing/universal/ClothingCartModal.tsx', new: 'RetailCartModal.tsx' },
  { old: 'clothing/universal/ClothingFloatingCart.tsx', new: 'RetailFloatingCart.tsx' },
  { old: 'clothing/universal/ClothingFloatingDock.tsx', new: 'RetailFloatingDock.tsx' },
  { old: 'clothing/universal/ClothingQuickViewModal.tsx', new: 'RetailQuickViewModal.tsx' },
  { old: 'electronic/universal/ElectronicCartDrawer.tsx', new: 'TechCartDrawer.tsx' },
  { old: 'electronic/universal/ElectronicProductModal.tsx', new: 'TechProductModal.tsx' },
  { old: 'groceries/universal/GroceriesCartDrawer.tsx', new: 'FreshCartDrawer.tsx' },
  { old: 'groceries/universal/GroceriesProductModal.tsx', new: 'FreshProductModal.tsx' },
];

moves.forEach(m => {
  const oldPath = path.join(baseDir, m.old);
  const newPath = path.join(universalDir, m.new);
  if (fs.existsSync(oldPath)) {
    let content = fs.readFileSync(oldPath, 'utf8');
    
    // Replace old types with unified ones
    content = content.replace(/ClothingCartItem|ElectronicCartItem|GroceriesCartItem/g, 'RetailCartItem');
    // Replace the context import
    content = content.replace(/\.\.\/\.\.\/core\/[A-Za-z]+Context/g, '../core/RetailDemoContext');
    content = content.replace(/useClothingDemo|useElectronicDemo|useGroceriesDemo/g, 'useRetailDemo');
    
    fs.writeFileSync(newPath, content);
    console.log(`Moved and updated to ${m.new}`);
  }
});
