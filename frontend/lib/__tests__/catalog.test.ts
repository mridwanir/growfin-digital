import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeVariantOption,
  normalizeProduct,
  calculateItemPrice,
  hasValidDiscount,
  getDiscountPercentage,
  buildCartItemHash,
} from '../catalog';

describe('normalizeVariantOption', () => {
  it('normalizes legacy strings with currency format (+Rp 5.000)', () => {
    const result = normalizeVariantOption('Large (+Rp 5.000)');
    assert.deepEqual(result, { label: 'Large', priceModifier: 5000 });
  });

  it('normalizes legacy strings with dense format (+Rp5.000)', () => {
    const result = normalizeVariantOption('Extra Cheese (+Rp5.000)');
    assert.deepEqual(result, { label: 'Extra Cheese', priceModifier: 5000 });
  });

  it('normalizes legacy strings with dot or comma thousands separators (+Rp 15,000)', () => {
    const result = normalizeVariantOption('Mega Box (+Rp 15,000)');
    assert.deepEqual(result, { label: 'Mega Box', priceModifier: 15000 });
  });

  it('normalizes legacy strings without currency symbol (+5000)', () => {
    const result = normalizeVariantOption('Extra Shot (+5000)');
    assert.deepEqual(result, { label: 'Extra Shot', priceModifier: 5000 });
  });

  it('normalizes legacy strings with negative modifier (-Rp 2.000)', () => {
    const result = normalizeVariantOption('No Ice (-Rp 2.000)');
    assert.deepEqual(result, { label: 'No Ice', priceModifier: -2000 });
  });

  it('normalizes plain strings without modifier to priceModifier 0', () => {
    const result = normalizeVariantOption('Regular');
    assert.deepEqual(result, { label: 'Regular', priceModifier: 0 });
  });

  it('passes through structured VariantOption objects with trimmed label and numeric modifier', () => {
    const result = normalizeVariantOption({ label: '  XL  ', priceModifier: 10000 });
    assert.deepEqual(result, { label: 'XL', priceModifier: 10000 });
  });

  it('handles structured VariantOption with string priceModifier gracefully', () => {
    const result = normalizeVariantOption({ label: 'Medium', priceModifier: '3000' as unknown as number });
    assert.deepEqual(result, { label: 'Medium', priceModifier: 3000 });
  });
});

describe('normalizeProduct', () => {
  it('normalizes legacy variant option strings into structured VariantOption[]', () => {
    const raw = {
      id: 1,
      name: 'Kopi Susu',
      desc: 'Espresso with fresh milk',
      price: 'Rp 20.000',
      variants: [
        {
          name: 'Size',
          options: ['Regular', 'Large (+Rp 5.000)'],
        },
      ],
    };

    const normalized = normalizeProduct(raw);
    assert.equal(normalized.name, 'Kopi Susu');
    assert.deepEqual(normalized.variants, [
      {
        name: 'Size',
        options: [
          { label: 'Regular', priceModifier: 0 },
          { label: 'Large', priceModifier: 5000 },
        ],
      },
    ]);
  });

  it('normalizes string originalPrice to numeric number', () => {
    const raw = {
      id: 2,
      name: 'T-Shirt',
      desc: 'Cotton combed 30s',
      price: '100000',
      originalPrice: 'Rp 150.000',
    };

    const normalized = normalizeProduct(raw);
    assert.equal(normalized.originalPrice, 150000);
  });

  it('leaves numeric originalPrice intact', () => {
    const raw = {
      id: 3,
      name: 'Sneakers',
      desc: 'Casual sneakers',
      price: '250000',
      originalPrice: 300000,
    };

    const normalized = normalizeProduct(raw);
    assert.equal(normalized.originalPrice, 300000);
  });

  it('sets undefined for invalid or missing originalPrice', () => {
    const raw1 = { id: 4, name: 'Item A', desc: '', price: '10000' };
    const raw2 = { id: 5, name: 'Item B', desc: '', price: '10000', originalPrice: '' };
    const raw3 = { id: 6, name: 'Item C', desc: '', price: '10000', originalPrice: 'abc' };

    assert.equal(normalizeProduct(raw1).originalPrice, undefined);
    assert.equal(normalizeProduct(raw2).originalPrice, undefined);
    assert.equal(normalizeProduct(raw3).originalPrice, undefined);
  });

  it('normalizes specifications and caps imageGallery to 5 photos', () => {
    const raw = {
      id: 7,
      name: 'Mechanical Keyboard',
      desc: 'Wireless mechanical keyboard',
      price: '500000',
      imageGallery: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg'],
      specifications: [
        { label: 'Switch', value: 'Gateron Yellow' },
        { label: 'Battery', value: '4000mAh' },
      ],
    };

    const normalized = normalizeProduct(raw);
    assert.equal(normalized.imageGallery?.length, 5);
    assert.deepEqual(normalized.imageGallery, ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg']);
    assert.deepEqual(normalized.specifications, [
      { label: 'Switch', value: 'Gateron Yellow' },
      { label: 'Battery', value: '4000mAh' },
    ]);
  });
});

describe('calculateItemPrice', () => {
  it('calculates price from pure numeric basePrice without variants or addons', () => {
    const price = calculateItemPrice(50000, [], []);
    assert.equal(price, 50000);
  });

  it('calculates price from formatted string basePrice', () => {
    const price = calculateItemPrice('Rp 25.000', [], []);
    assert.equal(price, 25000);
  });

  it('adds modifiers from structured VariantOption objects', () => {
    const price = calculateItemPrice(
      30000,
      [
        { label: 'Large', priceModifier: 5000 },
        { label: 'Oat Milk', priceModifier: 7000 },
      ],
      []
    );
    assert.equal(price, 42000);
  });

  it('adds modifiers from legacy variant strings', () => {
    const price = calculateItemPrice(
      20000,
      ['Large (+Rp 5.000)', 'Extra Cheese (+Rp5.000)'],
      []
    );
    assert.equal(price, 30000);
  });

  it('handles mixed structured options and legacy strings', () => {
    const price = calculateItemPrice(
      100000,
      [
        { label: '256GB', priceModifier: 2000000 },
        'AppleCare (+Rp 500.000)',
      ],
      []
    );
    assert.equal(price, 2600000);
  });

  it('adds addon prices accurately', () => {
    const price = calculateItemPrice(
      25000,
      [],
      [{ price: 3000 }, { price: 4000 }]
    );
    assert.equal(price, 32000);
  });

  it('handles negative variant modifiers', () => {
    const price = calculateItemPrice(
      20000,
      ['No Sugar (-Rp 2.000)'],
      []
    );
    assert.equal(price, 18000);
  });

  it('sums basePrice + variants + addons simultaneously', () => {
    const price = calculateItemPrice(
      'Rp 45.000',
      [{ label: 'Upgraded Fabric', priceModifier: 15000 }],
      [{ price: 5000 }, { price: 2500 }]
    );
    assert.equal(price, 67500);
  });

  it('returns non-negative integer even with malformed or negative basePrice', () => {
    const price = calculateItemPrice('invalid', [], []);
    assert.equal(price, 0);
  });
});

describe('hasValidDiscount', () => {
  it('returns true when originalPrice is strictly greater than price', () => {
    assert.equal(hasValidDiscount(80000, 100000), true);
  });

  it('returns false when originalPrice is equal to price', () => {
    assert.equal(hasValidDiscount(80000, 80000), false);
  });

  it('returns false when originalPrice is less than price', () => {
    assert.equal(hasValidDiscount(90000, 80000), false);
  });

  it('returns false when originalPrice is undefined, empty, or invalid', () => {
    assert.equal(hasValidDiscount(50000, undefined), false);
    assert.equal(hasValidDiscount(50000, ''), false);
    assert.equal(hasValidDiscount(50000, 'invalid'), false);
  });

  it('supports formatted Rupiah strings for comparison', () => {
    assert.equal(hasValidDiscount('Rp 75.000', 'Rp 100.000'), true);
    assert.equal(hasValidDiscount('Rp 120.000', 'Rp 100.000'), false);
  });
});

describe('getDiscountPercentage', () => {
  it('calculates rounded discount percentage when originalPrice > price', () => {
    assert.equal(getDiscountPercentage(80000, 100000), 20);
    assert.equal(getDiscountPercentage(100000, 150000), 33);
  });

  it('returns 0 when originalPrice <= price or invalid', () => {
    assert.equal(getDiscountPercentage(100000, 100000), 0);
    assert.equal(getDiscountPercentage(120000, 100000), 0);
    assert.equal(getDiscountPercentage(100000, undefined), 0);
    assert.equal(getDiscountPercentage(100000, ''), 0);
  });

  it('supports formatted Rupiah strings', () => {
    assert.equal(getDiscountPercentage('Rp 150.000', 'Rp 200.000'), 25);
  });
});

describe('buildCartItemHash', () => {
  it('yields identical hash regardless of variant key insertion order', () => {
    const hashA = buildCartItemHash(
      12,
      { Size: 'Large', Color: 'Midnight Blue', Sugar: 'Normal' },
      ['Ice']
    );
    const hashB = buildCartItemHash(
      12,
      { Sugar: 'Normal', Size: 'Large', Color: 'Midnight Blue' },
      ['Ice']
    );
    assert.equal(hashA, hashB);
  });

  it('yields identical hash regardless of addon array ordering', () => {
    const hashA = buildCartItemHash(
      42,
      { Size: 'Regular' },
      ['Extra Shot', 'Oat Milk', 'Whipped Cream']
    );
    const hashB = buildCartItemHash(
      42,
      { Size: 'Regular' },
      ['Whipped Cream', 'Extra Shot', 'Oat Milk']
    );
    assert.equal(hashA, hashB);
  });

  it('normalizes legacy variant strings and structured VariantOption to identical hash', () => {
    const hashLegacy = buildCartItemHash(
      99,
      { Size: 'Large (+Rp 5.000)' },
      []
    );
    const hashStructured = buildCartItemHash(
      99,
      { Size: { label: 'Large', priceModifier: 5000 } },
      []
    );
    assert.equal(hashLegacy, hashStructured);
  });

  it('produces distinct hashes for different variants or products', () => {
    const hashProduct1 = buildCartItemHash(1, { Size: 'Small' }, []);
    const hashProduct2 = buildCartItemHash(2, { Size: 'Small' }, []);
    const hashDifferentVariant = buildCartItemHash(1, { Size: 'Large' }, []);
    const hashWithAddon = buildCartItemHash(1, { Size: 'Small' }, ['Extra Cheese']);

    assert.notEqual(hashProduct1, hashProduct2);
    assert.notEqual(hashProduct1, hashDifferentVariant);
    assert.notEqual(hashProduct1, hashWithAddon);
  });

  it('handles empty or undefined variants and addons without throwing', () => {
    const hash1 = buildCartItemHash('item-123', {}, []);
    const hash2 = buildCartItemHash('item-123', {} as Record<string, string>, []);
    assert.equal(hash1, hash2);
    assert.ok(hash1.length > 0);
  });
});
