import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeGeneratedMetadata,
  normalizeProduct,
  calculateItemPrice,
  buildCartItemHash,
  formatVariantReceiptLine,
  formatVariantOptionDisplay,
  hasValidDiscount,
  getDiscountPercentage,
  hasSpecifications,
  getValidSpecifications,
  getProductGalleryImages,
} from '../catalog';
import type { BusinessDemo, MenuItem, VariantOption } from '../types';

describe('AI Generation Schema & Normalization Seam', () => {
  describe('normalizeGeneratedMetadata', () => {
    it('normalizes simulated AI response with structured variants and originalPrice', () => {
      const simulatedAiResponse = {
        name: 'Kopi Kenangan Senja',
        category: 'Cafe & Coffee Shop',
        tagline: 'Secangkir kenangan di sore hari',
        reviews: [
          { authorName: 'Budi', rating: 4.8, text: 'Enak kopinya', time: '1 hari lalu' },
          { authorName: 'Ani', rating: 0, text: 'Kurang manis', time: '2 hari lalu' },
          { authorName: 'Cici', rating: 6, text: 'Luar biasa!', time: '3 hari lalu' },
        ],
        menu: [
          {
            id: 1,
            name: 'Kopi Susu Senja',
            desc: 'Espresso dengan susu aren khas',
            price: 'Rp 22.000',
            originalPrice: 28000,
            category: 'Kopi',
            variants: [
              {
                name: 'Ukuran',
                options: [
                  { label: 'Regular', priceModifier: 0 },
                  { label: 'Large', priceModifier: 6000 },
                ],
              },
              {
                name: 'Tingkat Manis',
                options: [
                  { label: 'Normal Sugar', priceModifier: 0 },
                  { label: 'Less Sugar', priceModifier: 0 },
                ],
              },
            ],
            specifications: [
              { label: 'Komposisi', value: 'Espresso Arabica + Susu Segar + Gula Aren' },
              { label: 'Volume', value: '350ml' },
            ],
          },
        ],
      };

      const normalized = normalizeGeneratedMetadata(simulatedAiResponse);

      // Verify review ratings clamped to 1-5 integer
      assert.equal(normalized.reviews[0].rating, 5);
      assert.equal(normalized.reviews[1].rating, 1);
      assert.equal(normalized.reviews[2].rating, 5);

      // Verify menu item normalization
      assert.equal(normalized.menu.length, 1);
      const item = normalized.menu[0];
      assert.equal(item.name, 'Kopi Susu Senja');
      assert.equal(item.price, 'Rp 22.000');
      assert.equal(item.originalPrice, 28000);

      // Verify structured variants preserved
      assert.deepEqual(item.variants, [
        {
          name: 'Ukuran',
          options: [
            { label: 'Regular', priceModifier: 0 },
            { label: 'Large', priceModifier: 6000 },
          ],
        },
        {
          name: 'Tingkat Manis',
          options: [
            { label: 'Normal Sugar', priceModifier: 0 },
            { label: 'Less Sugar', priceModifier: 0 },
          ],
        },
      ]);

      // Verify specifications
      assert.deepEqual(item.specifications, [
        { label: 'Komposisi', value: 'Espresso Arabica + Susu Segar + Gula Aren' },
        { label: 'Volume', value: '350ml' },
      ]);
    });

    it('normalizes legacy string options in simulated AI response into structured VariantOption objects', () => {
      const simulatedLegacyResponse = {
        name: 'Warung Mie Sedap',
        category: 'Restaurant',
        menu: [
          {
            id: 10,
            name: 'Mie Ayam Komplit',
            desc: 'Mie kenyal dengan topping ayam jamur dan bakso pangsit',
            price: 'Rp 25.000',
            originalPrice: '30.000',
            variants: [
              {
                name: 'Porsi',
                options: ['Regular', 'Jumbo (+Rp 7.000)'],
              },
              {
                name: 'Level Pedas',
                options: ['Level 0 (Tidak Pedas)', 'Level 1-3 (+Rp 2.000)'],
              },
            ],
          },
        ],
      };

      const normalized = normalizeGeneratedMetadata(simulatedLegacyResponse);
      const item = normalized.menu[0];

      assert.equal(item.originalPrice, 30000);
      assert.deepEqual(item.variants, [
        {
          name: 'Porsi',
          options: [
            { label: 'Regular', priceModifier: 0 },
            { label: 'Jumbo', priceModifier: 7000 },
          ],
        },
        {
          name: 'Level Pedas',
          options: [
            { label: 'Level 0 (Tidak Pedas)', priceModifier: 0 },
            { label: 'Level 1-3', priceModifier: 2000 },
          ],
        },
      ]);
    });

    it('unifies "products" array into "menu" property when AI returns products key', () => {
      const simulatedAiResponseWithProducts = {
        name: 'Distro Fashion Keren',
        category: 'Clothing Store',
        products: [
          {
            id: 101,
            name: 'Kaos Polos Oversize',
            desc: 'Bahan cotton combed 24s adem',
            price: 'Rp 85.000',
            variants: [
              {
                name: 'Ukuran',
                options: [
                  { label: 'M', priceModifier: 0 },
                  { label: 'L', priceModifier: 0 },
                  { label: 'XL', priceModifier: 5000 },
                ],
              },
            ],
          },
        ],
      };

      const normalized = normalizeGeneratedMetadata(simulatedAiResponseWithProducts);

      assert.ok(Array.isArray(normalized.menu));
      assert.equal(normalized.menu.length, 1);
      assert.equal(normalized.menu[0].name, 'Kaos Polos Oversize');
      assert.deepEqual(normalized.menu[0].variants?.[0].options, [
        { label: 'M', priceModifier: 0 },
        { label: 'L', priceModifier: 0 },
        { label: 'XL', priceModifier: 5000 },
      ]);
    });

    it('handles null, undefined, or empty metadata gracefully', () => {
      assert.deepEqual(normalizeGeneratedMetadata(null), { menu: [] });
      assert.deepEqual(normalizeGeneratedMetadata(undefined), { menu: [] });
      assert.deepEqual(normalizeGeneratedMetadata({}), { menu: [] });
    });
  });

  describe('Inbound preview data rendering without errors', () => {
    it('simulates preview rendering workflow: calculation, cart hashing, and receipt formatting', () => {
      const rawAiResponse = {
        name: 'Kopi Barista Modern',
        category: 'Cafe & Coffee Shop',
        menu: [
          {
            id: 1,
            name: 'Caramel Macchiato',
            desc: 'Espresso dengan sirup vanila dan busa karamel',
            price: 'Rp 32.000',
            originalPrice: 40000,
            variants: [
              {
                name: 'Ukuran',
                options: [
                  { label: 'Regular', priceModifier: 0 },
                  { label: 'Large', priceModifier: 6000 },
                ],
              },
              {
                name: 'Tipe Susu',
                options: [
                  { label: 'Fresh Milk', priceModifier: 0 },
                  { label: 'Oat Milk', priceModifier: 8000 },
                ],
              },
            ],
            specifications: [
              { label: 'Roast Level', value: 'Medium-Dark' },
              { label: 'Origin', value: 'Aceh Gayo' },
            ],
          },
        ],
      };

      const normalizedMetadata = normalizeGeneratedMetadata(rawAiResponse);
      const product = normalizedMetadata.menu[0];

      // 1. Strikethrough pricing & discount badge
      assert.equal(hasValidDiscount(product.price, product.originalPrice), true);
      assert.equal(getDiscountPercentage(product.price, product.originalPrice), 20); // (40000 - 32000) / 40000 = 20%

      // 2. Specifications rendering
      assert.equal(hasSpecifications(product), true);
      assert.deepEqual(getValidSpecifications(product.specifications), [
        { label: 'Roast Level', value: 'Medium-Dark' },
        { label: 'Origin', value: 'Aceh Gayo' },
      ]);

      // 3. User selects 'Large' (+6000) and 'Oat Milk' (+8000)
      const selectedVariants: Record<string, VariantOption> = {
        Ukuran: { label: 'Large', priceModifier: 6000 },
        'Tipe Susu': { label: 'Oat Milk', priceModifier: 8000 },
      };

      // Dynamic price calculation
      const dynamicTotal = calculateItemPrice(
        product.price,
        Object.values(selectedVariants),
        []
      );
      assert.equal(dynamicTotal, 46000); // 32000 + 6000 + 8000 = 46000

      // Cart composite hash generation
      const cartHash = buildCartItemHash(product.id, selectedVariants, []);
      assert.ok(cartHash.includes('Large:6000'));
      assert.ok(cartHash.includes('Oat Milk:8000'));

      // WhatsApp receipt formatting
      const receiptLine = formatVariantReceiptLine(selectedVariants);
      assert.ok(receiptLine.includes('Ukuran: Large (+Rp 6.000)'));
      assert.ok(receiptLine.includes('Tipe Susu: Oat Milk (+Rp 8.000)'));
    });

    it('renders zero-cost default options cleanly without awkward +Rp 0 labels', () => {
      const selectedVariants: Record<string, VariantOption> = {
        Ukuran: { label: 'Regular', priceModifier: 0 },
        Gula: { label: 'Normal Sugar', priceModifier: 0 },
      };

      const displayUkuran = formatVariantOptionDisplay('Ukuran', selectedVariants.Ukuran);
      assert.equal(displayUkuran, 'Ukuran: Regular');

      const receiptLine = formatVariantReceiptLine(selectedVariants);
      assert.equal(receiptLine, 'Ukuran: Regular, Gula: Normal Sugar');
    });

    it('safely handles legacy demos without throwing runtime errors across archetypes', () => {
      const legacyDemoProducts: MenuItem[] = [
        {
          id: 1,
          name: 'Produk Lama Tanpa Varian',
          desc: 'Deskripsi lama',
          price: '50000',
        },
        {
          id: 2,
          name: 'Produk Lama String Varian',
          desc: 'Deskripsi lama 2',
          price: '25000',
          variants: [
            {
              name: 'Ukuran',
              options: ['Kecil', 'Sedang (+Rp 3.000)', 'Besar (+Rp 6.000)'],
            },
          ],
        },
      ];

      const normalizedProducts = legacyDemoProducts.map(normalizeProduct);

      // Product 1: empty/no variants
      assert.equal(normalizedProducts[0].variants, undefined);
      assert.equal(calculateItemPrice(normalizedProducts[0].price), 50000);

      // Product 2: normalized options
      const p2 = normalizedProducts[1];
      assert.ok(p2.variants);
      assert.equal(p2.variants[0].options.length, 3);
      assert.deepEqual(p2.variants[0].options[0], { label: 'Kecil', priceModifier: 0 });
      assert.deepEqual(p2.variants[0].options[1], { label: 'Sedang', priceModifier: 3000 });
      assert.deepEqual(p2.variants[0].options[2], { label: 'Besar', priceModifier: 6000 });

      // Calculate price with Sedang (+3000)
      const totalPrice = calculateItemPrice(p2.price, [p2.variants[0].options[1]]);
      assert.equal(totalPrice, 28000);
    });
  });
});
