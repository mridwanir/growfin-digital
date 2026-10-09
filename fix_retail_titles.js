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

      // ProductGrid / Menu
      if (content.match(/>Koleksi Terbaru</)) {
        content = content.replace(/>Koleksi Terbaru</g, '>{client.menuTitle || "Koleksi Terbaru"}<');
        changed = true;
      }
      if (content.match(/>Katalog Produk</)) {
        content = content.replace(/>Katalog Produk</g, '>{client.menuTitle || "Katalog Produk"}<');
        changed = true;
      }
      if (content.match(/>Produk Pilihan</)) {
        content = content.replace(/>Produk Pilihan</g, '>{client.menuTitle || "Produk Pilihan"}<');
        changed = true;
      }
      if (content.match(/>Bahan Segar Pilihan</)) {
        content = content.replace(/>Bahan Segar Pilihan</g, '>{client.menuTitle || "Bahan Segar Pilihan"}<');
        changed = true;
      }
      if (content.match(/>Etalase Produk</)) {
        content = content.replace(/>Etalase Produk</g, '>{client.menuTitle || "Etalase Produk"}<');
        changed = true;
      }

      // Descriptions for Menu
      if (content.match(/>Pilihan produk dengan kualitas terbaik dari \{client\.name\}\.</)) {
        content = content.replace(/>Pilihan produk dengan kualitas terbaik dari \{client\.name\}\.</g, '>{client.menuDescription || `Pilihan produk dengan kualitas terbaik dari ${client.name}.`}<');
        changed = true;
      }

      // Gallery / Lookbook
      if (content.match(/>Lookbook Inspirasi</)) {
        content = content.replace(/>Lookbook Inspirasi</g, '>{client.galleryTitle || "Lookbook Inspirasi"}<');
        changed = true;
      }
      if (content.match(/>Galeri Inovasi</)) {
        content = content.replace(/>Galeri Inovasi</g, '>{client.galleryTitle || "Galeri Inovasi"}<');
        changed = true;
      }
      if (content.match(/>Galeri Belanja</)) {
        content = content.replace(/>Galeri Belanja</g, '>{client.galleryTitle || "Galeri Belanja"}<');
        changed = true;
      }
      if (content.match(/>Kesegaran Harian</)) {
        content = content.replace(/>Kesegaran Harian</g, '>{client.galleryTitle || "Kesegaran Harian"}<');
        changed = true;
      }

      // Reviews
      if (content.match(/>Kata Mereka</)) {
        content = content.replace(/>Kata Mereka</g, '>{client.reviewsTitle || "Kata Mereka"}<');
        changed = true;
      }
      if (content.match(/>Ulasan Pelanggan</)) {
        content = content.replace(/>Ulasan Pelanggan</g, '>{client.reviewsTitle || "Ulasan Pelanggan"}<');
        changed = true;
      }
      
      // Descriptions for Reviews
      if (content.match(/>Ulasan dari pelanggan setia \{client\.name\}\.</)) {
        content = content.replace(/>Ulasan dari pelanggan setia \{client\.name\}\.</g, '>{client.reviewsDescription || `Ulasan dari pelanggan setia ${client.name}.`}<');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed dynamic titles in ' + file);
      }
    }
  });
}

processDir(dir);
