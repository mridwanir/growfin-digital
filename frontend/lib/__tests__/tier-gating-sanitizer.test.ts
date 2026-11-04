import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeMenuItem, sanitizeMenuItems } from '../tier-sanitizer';
import { PACKAGE_LIMITS, PackageTier } from '../site-config';
import type { MenuItem, VariantOption } from '../types';

describe('tier-gating-sanitizer', () => {
  const sampleMenuItem: MenuItem = {
    id: 1,
    name: 'Kopi Susu Gula Aren',
    desc: 'Kopi susu dengan gula aren asli',
    price: '18000',
    originalPrice: '22000',
    imageGallery: [
      'https://res.cloudinary.com/demo/image/upload/sample1.jpg',
      'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
    ],
    specifications: [
      { label: 'Volume', value: '250ml' },
      { label: 'Kalori', value: '180 kkal' },
    ],
    variants: [
      {
        name: 'Ukuran',
        options: [
          { label: 'Regular', priceModifier: 0 },
          { label: 'Large', priceModifier: 5000 },
          'Jumbo (+Rp 8.000)',
        ],
      },
      {
        name: 'Level Gula',
        options: [
          { label: 'Normal', priceModifier: 0 },
          { label: 'Less Sugar', priceModifier: 0 },
        ],
      },
    ],
  };

  describe('when advancedVariants is false (e.g. instan, pro-basic)', () => {
    it('strips imageGallery and specifications from menu item', () => {
      const sanitized = sanitizeMenuItem(sampleMenuItem, { advancedVariants: false });

      assert.strictEqual(sanitized.imageGallery, undefined);
      assert.strictEqual(sanitized.specifications, undefined);
      assert.strictEqual('imageGallery' in sanitized, false);
      assert.strictEqual('specifications' in sanitized, false);
      assert.strictEqual(sanitized.name, 'Kopi Susu Gula Aren');
      assert.strictEqual(sanitized.price, '18000');
    });

    it('strips numeric priceModifiers from structured variant options and legacy string options', () => {
      const sanitized = sanitizeMenuItem(sampleMenuItem, { advancedVariants: false });

      assert.ok(sanitized.variants);
      assert.strictEqual(sanitized.variants!.length, 2);

      const ukuranVariant = sanitized.variants![0];
      assert.strictEqual(ukuranVariant.name, 'Ukuran');
      assert.strictEqual(ukuranVariant.options.length, 3);

      // Structured options have priceModifier stripped to 0
      assert.deepStrictEqual(ukuranVariant.options[0], { label: 'Regular', priceModifier: 0 });
      assert.deepStrictEqual(ukuranVariant.options[1], { label: 'Large', priceModifier: 0 });
      // Legacy string option 'Jumbo (+Rp 8.000)' has suffix removed and priceModifier 0
      assert.deepStrictEqual(ukuranVariant.options[2], { label: 'Jumbo', priceModifier: 0 });

      // Zero-modifier options remain zero
      const gulaVariant = sanitized.variants![1];
      assert.deepStrictEqual(gulaVariant.options[0], { label: 'Normal', priceModifier: 0 });
      assert.deepStrictEqual(gulaVariant.options[1], { label: 'Less Sugar', priceModifier: 0 });
    });

    it('sanitizes an array of menu items with sanitizeMenuItems', () => {
      const result = sanitizeMenuItems([sampleMenuItem], { advancedVariants: false });
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].imageGallery, undefined);
      assert.strictEqual(result[0].specifications, undefined);
      const secondOpt = result[0].variants?.[0].options[1] as VariantOption;
      assert.strictEqual(secondOpt.priceModifier, 0);
    });
  });

  describe('when advancedVariants is true (e.g. pro-advanced, enterprise, free_trial)', () => {
    it('preserves imageGallery and specifications', () => {
      const sanitized = sanitizeMenuItem(sampleMenuItem, { advancedVariants: true });

      assert.ok(sanitized.imageGallery);
      assert.strictEqual(sanitized.imageGallery!.length, 2);
      assert.deepStrictEqual(sanitized.imageGallery, sampleMenuItem.imageGallery);

      assert.ok(sanitized.specifications);
      assert.strictEqual(sanitized.specifications!.length, 2);
      assert.deepStrictEqual(sanitized.specifications, sampleMenuItem.specifications);
    });

    it('preserves variant options with numeric priceModifiers', () => {
      const sanitized = sanitizeMenuItem(sampleMenuItem, { advancedVariants: true });

      assert.ok(sanitized.variants);
      const ukuranVariant = sanitized.variants![0];
      assert.deepStrictEqual(ukuranVariant.options[0], { label: 'Regular', priceModifier: 0 });
      assert.deepStrictEqual(ukuranVariant.options[1], { label: 'Large', priceModifier: 5000 });
      // Legacy strings normalized to structured with original modifier preserved
      assert.deepStrictEqual(ukuranVariant.options[2], { label: 'Jumbo', priceModifier: 8000 });
    });

    it('caps imageGallery at 5 images if more are provided', () => {
      const itemWithManyImages: MenuItem = {
        ...sampleMenuItem,
        imageGallery: [
          'https://demo.com/1.jpg',
          'https://demo.com/2.jpg',
          'https://demo.com/3.jpg',
          'https://demo.com/4.jpg',
          'https://demo.com/5.jpg',
          'https://demo.com/6.jpg',
        ],
      };
      const sanitized = sanitizeMenuItem(itemWithManyImages, { advancedVariants: true });
      assert.strictEqual(sanitized.imageGallery?.length, 5);
    });
  });

  describe('tier package permissions', () => {
    it('grants free_trial tier full access to advanced variants as upsell hook', () => {
      const limits = PACKAGE_LIMITS['free_trial'];
      assert.strictEqual(limits.advancedVariants, true);

      const sanitized = sanitizeMenuItem(sampleMenuItem, {
        advancedVariants: limits.advancedVariants,
      });

      assert.ok(sanitized.imageGallery);
      assert.ok(sanitized.specifications);
      const secondOpt = sanitized.variants?.[0].options[1] as VariantOption;
      assert.strictEqual(secondOpt.priceModifier, 5000);
    });

    it('locks advanced variants on instan tier', () => {
      const limits = PACKAGE_LIMITS['instan'];
      assert.strictEqual(limits.advancedVariants, false);

      const sanitized = sanitizeMenuItem(sampleMenuItem, {
        advancedVariants: limits.advancedVariants,
      });

      assert.strictEqual(sanitized.imageGallery, undefined);
      assert.strictEqual(sanitized.specifications, undefined);
      const secondOpt = sanitized.variants?.[0].options[1] as VariantOption;
      assert.strictEqual(secondOpt.priceModifier, 0);
    });

    it('locks advanced variants on pro-basic tier', () => {
      const limits = PACKAGE_LIMITS['pro-basic'];
      assert.strictEqual(limits.advancedVariants, false);

      const sanitized = sanitizeMenuItem(sampleMenuItem, {
        advancedVariants: limits.advancedVariants,
      });

      assert.strictEqual(sanitized.imageGallery, undefined);
      assert.strictEqual(sanitized.specifications, undefined);
      const secondOpt = sanitized.variants?.[0].options[1] as VariantOption;
      assert.strictEqual(secondOpt.priceModifier, 0);
    });

    it('grants pro-advanced and enterprise tiers access to advanced variants', () => {
      const proAdvancedLimits = PACKAGE_LIMITS['pro-advanced'];
      assert.strictEqual(proAdvancedLimits.advancedVariants, true);

      const enterpriseLimits = PACKAGE_LIMITS['enterprise'];
      assert.strictEqual(enterpriseLimits.advancedVariants, true);
    });
  });

  describe('edge cases', () => {
    it('handles menu item with undefined variants, imageGallery, and specifications', () => {
      const simpleItem: MenuItem = {
        id: 2,
        name: 'Teh Manis',
        desc: 'Teh manis segar',
        price: '5000',
      };

      const sanitizedFalse = sanitizeMenuItem(simpleItem, { advancedVariants: false });
      assert.strictEqual(sanitizedFalse.name, 'Teh Manis');
      assert.strictEqual(sanitizedFalse.imageGallery, undefined);
      assert.strictEqual(sanitizedFalse.specifications, undefined);

      const sanitizedTrue = sanitizeMenuItem(simpleItem, { advancedVariants: true });
      assert.strictEqual(sanitizedTrue.name, 'Teh Manis');
    });

    it('handles empty menu array cleanly', () => {
      const result = sanitizeMenuItems([], { advancedVariants: false });
      assert.deepStrictEqual(result, []);
    });
  });
});
