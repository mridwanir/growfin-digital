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
      let changed = false;

      // Replace generic >Katalog...< inside ProductGrid
      if (file.includes('ProductGrid')) {
        if (content.match(/>Katalog[^<]*</)) {
          content = content.replace(/>Katalog[^<]*</g, '>{client.menuTitle || "Katalog Produk"}<');
          changed = true;
        }
      }

      // Replace generic >Lookbook...< inside Lookbook
      if (file.includes('Lookbook')) {
        if (content.match(/>Lookbook[^<]*</)) {
          content = content.replace(/>Lookbook[^<]*</g, '>{client.galleryTitle || "Lookbook"}<');
          changed = true;
        }
      }

      // Replace generic >Ulasan...< inside Reviews
      if (file.includes('Reviews')) {
        if (content.match(/>Ulasan[^<]*</)) {
          content = content.replace(/>Ulasan[^<]*</g, '>{client.reviewsTitle || "Ulasan Pelanggan"}<');
          changed = true;
        }
      }
      
      // Fix generic Hero tagline (currently hardcoded on some themes)
      if (file.includes('Hero')) {
        if (content.match(/>Dapatkan Pakaian Keren</)) {
          content = content.replace(/>Dapatkan Pakaian Keren</g, '>{client.tagline}<');
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed regex titles in ' + file);
      }
    }
  });
}

processDir(dir);
