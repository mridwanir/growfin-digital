import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  hasValidDiscount,
  getDiscountPercentage,
  getProductGalleryImages,
  getValidSpecifications,
  hasSpecifications,
  normalizeProduct,
} from '../catalog';

describe('Product Showcase: Strikethrough Pricing & Discount Badge', () => {
  it('returns true for hasValidDiscount only when originalPrice > price', () => {
    assert.strictEqual(hasValidDiscount(100000, 150000), true);
    assert.strictEqual(hasValidDiscount('Rp 100.000', 'Rp 150.000'), true);
    assert.strictEqual(hasValidDiscount('100000', '120000'), true);
  });

  it('returns false for hasValidDiscount when originalPrice <= price', () => {
    assert.strictEqual(hasValidDiscount(100000, 100000), false);
    assert.strictEqual(hasValidDiscount(120000, 100000), false);
    assert.strictEqual(hasValidDiscount('Rp 100.000', 'Rp 100.000'), false);
    assert.strictEqual(hasValidDiscount('Rp 150.000', 'Rp 100.000'), false);
  });

  it('returns false for hasValidDiscount when originalPrice is missing or invalid', () => {
    assert.strictEqual(hasValidDiscount(100000, undefined), false);
    assert.strictEqual(hasValidDiscount(100000, null as unknown as undefined), false);
    assert.strictEqual(hasValidDiscount(100000, ''), false);
    assert.strictEqual(hasValidDiscount(100000, 0), false);
    assert.strictEqual(hasValidDiscount(100000, -50000), false);
    assert.strictEqual(hasValidDiscount('Rp 100.000', 'invalid'), false);
  });

  it('calculates rounded discount percentage accurately', () => {
    // 25% discount: 100k -> 75k
    assert.strictEqual(getDiscountPercentage(75000, 100000), 25);
    // 33.67% -> rounds to 34%: 300k -> 199k
    assert.strictEqual(getDiscountPercentage('Rp 199.000', 'Rp 300.000'), 34);
    // 50% discount: 200k -> 100k
    assert.strictEqual(getDiscountPercentage(100000, 200000), 50);
    // 10% discount: 100k -> 90k
    assert.strictEqual(getDiscountPercentage('90000', '100000'), 10);
    // 75% discount: 100k -> 25k
    assert.strictEqual(getDiscountPercentage(25000, 100000), 75);
    // 1% discount: 100k -> 99k
    assert.strictEqual(getDiscountPercentage(99000, 100000), 1);
  });

  it('returns 0 discount percentage when no valid discount exists', () => {
    assert.strictEqual(getDiscountPercentage(100000, 100000), 0);
    assert.strictEqual(getDiscountPercentage(120000, 100000), 0);
    assert.strictEqual(getDiscountPercentage(100000, undefined), 0);
    assert.strictEqual(getDiscountPercentage(100000, 0), 0);
  });
});

describe('Product Showcase: Gallery Image Extraction', () => {
  it('extracts multi-photo array up to 5 photos from imageGallery', () => {
    const product = {
      id: 1,
      name: 'Wireless Headphone',
      price: '1500000',
      imageUrl: 'https://example.com/main.jpg',
      imageGallery: [
        'https://example.com/angle1.jpg',
        'https://example.com/angle2.jpg',
        'https://example.com/angle3.jpg',
      ],
    };
    const images = getProductGalleryImages(product);
    assert.deepStrictEqual(images, [
      'https://example.com/angle1.jpg',
      'https://example.com/angle2.jpg',
      'https://example.com/angle3.jpg',
    ]);
  });

  it('caps imageGallery at 5 photos when more are defined', () => {
    const product = {
      imageGallery: [
        'https://example.com/1.jpg',
        'https://example.com/2.jpg',
        'https://example.com/3.jpg',
        'https://example.com/4.jpg',
        'https://example.com/5.jpg',
        'https://example.com/6.jpg',
        'https://example.com/7.jpg',
      ],
    };
    const images = getProductGalleryImages(product);
    assert.strictEqual(images.length, 5);
    assert.deepStrictEqual(images, [
      'https://example.com/1.jpg',
      'https://example.com/2.jpg',
      'https://example.com/3.jpg',
      'https://example.com/4.jpg',
      'https://example.com/5.jpg',
    ]);
  });

  it('filters empty or whitespace strings from imageGallery', () => {
    const product = {
      imageGallery: [
        'https://example.com/1.jpg',
        '',
        '   ',
        'https://example.com/2.jpg',
      ],
    };
    const images = getProductGalleryImages(product);
    assert.deepStrictEqual(images, [
      'https://example.com/1.jpg',
      'https://example.com/2.jpg',
    ]);
  });

  it('falls back to single imageUrl when imageGallery is empty or missing', () => {
    const productWithEmptyGallery = {
      imageUrl: 'https://example.com/single.jpg',
      imageGallery: [],
    };
    assert.deepStrictEqual(
      getProductGalleryImages(productWithEmptyGallery),
      ['https://example.com/single.jpg']
    );

    const productWithoutGallery = {
      imageUrl: 'https://example.com/single.jpg',
    };
    assert.deepStrictEqual(
      getProductGalleryImages(productWithoutGallery),
      ['https://example.com/single.jpg']
    );
  });

  it('falls back to fallbackImage when imageGallery and imageUrl are both absent', () => {
    const productWithoutImages = {
      id: 99,
      name: 'No Image Product',
    };
    assert.deepStrictEqual(
      getProductGalleryImages(productWithoutImages, 'https://example.com/placeholder.jpg'),
      ['https://example.com/placeholder.jpg']
    );
  });

  it('returns empty array when product is undefined and no fallback is given', () => {
    assert.deepStrictEqual(getProductGalleryImages(null), []);
    assert.deepStrictEqual(getProductGalleryImages(undefined), []);
  });
});

describe('Product Showcase: Specifications Row Validation & Container Suppression', () => {
  it('returns valid trimmed specification key-value pairs', () => {
    const specs = [
      { label: ' Material ', value: ' 100% Cotton ' },
      { label: 'Weight', value: '250g' },
    ];
    const valid = getValidSpecifications(specs);
    assert.deepStrictEqual(valid, [
      { label: 'Material', value: '100% Cotton' },
      { label: 'Weight', value: '250g' },
    ]);
  });

  it('filters out invalid rows with empty label or empty value', () => {
    const specs = [
      { label: 'Color', value: 'Obsidian Black' },
      { label: '', value: 'Lost Value' },
      { label: '   ', value: 'Whitespace Label' },
      { label: 'Warranty', value: '' },
      { label: 'Origin', value: '   ' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
    ];
    const valid = getValidSpecifications(specs);
    assert.deepStrictEqual(valid, [
      { label: 'Color', value: 'Obsidian Black' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
    ]);
  });

  it('returns empty array for empty, null, or undefined specifications', () => {
    assert.deepStrictEqual(getValidSpecifications([]), []);
    assert.deepStrictEqual(getValidSpecifications(null), []);
    assert.deepStrictEqual(getValidSpecifications(undefined), []);
  });

  it('hasSpecifications correctly suppresses empty containers', () => {
    assert.strictEqual(hasSpecifications(null), false);
    assert.strictEqual(hasSpecifications({}), false);
    assert.strictEqual(hasSpecifications({ specifications: [] }), false);
    assert.strictEqual(
      hasSpecifications({
        specifications: [
          { label: '', value: 'empty' },
          { label: 'empty', value: '' },
        ],
      }),
      false
    );
    assert.strictEqual(
      hasSpecifications({
        specifications: [{ label: 'Battery', value: '4000mAh' }],
      }),
      true
    );
  });

  it('normalizes specifications through normalizeProduct cleanly', () => {
    const normalized = normalizeProduct({
      id: 1,
      name: 'Custom Watch',
      price: '500000',
      originalPrice: '750000',
      imageGallery: ['img1.jpg', '', 'img2.jpg'],
      specifications: [
        { label: 'Strap', value: 'Leather' },
        { label: '', value: 'Lost' },
        { label: 'Waterproof', value: '30m' },
      ],
    });

    assert.strictEqual(normalized.originalPrice, 750000);
    assert.deepStrictEqual(normalized.imageGallery, ['img1.jpg', 'img2.jpg']);
    assert.deepStrictEqual(normalized.specifications, [
      { label: 'Strap', value: 'Leather' },
      { label: 'Waterproof', value: '30m' },
    ]);
  });
});
