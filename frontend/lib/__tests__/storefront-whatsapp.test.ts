import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemPrice,
  buildCartItemHash,
  formatVariantOptionDisplay,
  formatVariantReceiptLine,
  stackCartItem,
} from '../catalog';
import type { VariantOption } from '../types';

describe('WhatsApp Receipt and Storefront Variant Formatting', () => {
  describe('formatVariantOptionDisplay', () => {
    it('shows plain label for zero-cost plain string option', () => {
      const result = formatVariantOptionDisplay('Ukuran', 'Regular');
      assert.strictEqual(result, 'Ukuran: Regular');
    });

    it('shows plain label for zero-cost structured VariantOption', () => {
      const opt: VariantOption = { label: 'Regular', priceModifier: 0 };
      const result = formatVariantOptionDisplay('Ukuran', opt);
      assert.strictEqual(result, 'Ukuran: Regular');
    });

    it('appends formatted surcharge badge for positive modifier legacy string', () => {
      const result = formatVariantOptionDisplay('Ukuran', 'Large (+Rp 5.000)');
      assert.strictEqual(result, 'Ukuran: Large (+Rp 5.000)');
    });

    it('appends formatted surcharge badge for positive modifier structured VariantOption', () => {
      const opt: VariantOption = { label: 'Large', priceModifier: 5000 };
      const result = formatVariantOptionDisplay('Ukuran', opt);
      assert.strictEqual(result, 'Ukuran: Large (+Rp 5.000)');
    });

    it('handles thousands formatting correctly for larger priceModifier', () => {
      const opt: VariantOption = { label: 'Extra Large', priceModifier: 25000 };
      const result = formatVariantOptionDisplay('Porsi', opt);
      assert.strictEqual(result, 'Porsi: Extra Large (+Rp 25.000)');
    });

    it('shows plain label without surcharge when priceModifier is negative or zero', () => {
      const opt: VariantOption = { label: 'Less Sugar', priceModifier: 0 };
      assert.strictEqual(formatVariantOptionDisplay('Gula', opt), 'Gula: Less Sugar');
    });

    it('returns empty or fallback when option is null or empty', () => {
      assert.strictEqual(formatVariantOptionDisplay('Ukuran', null), 'Ukuran');
      assert.strictEqual(formatVariantOptionDisplay('Ukuran', ''), 'Ukuran');
    });
  });

  describe('formatVariantReceiptLine', () => {
    it('formats multiple variant selections, itemizing surcharges only when positive', () => {
      const selections: Record<string, string | VariantOption> = {
        Ukuran: { label: 'Large', priceModifier: 5000 },
        Suhu: 'Dingin',
        Gula: { label: 'Normal', priceModifier: 0 },
      };
      const formatted = formatVariantReceiptLine(selections);
      assert.strictEqual(
        formatted,
        'Ukuran: Large (+Rp 5.000), Suhu: Dingin, Gula: Normal'
      );
    });

    it('returns empty string for empty selections', () => {
      assert.strictEqual(formatVariantReceiptLine({}), '');
    });
  });
});

describe('Dynamic Subtotal Pricing in Storefront Modals', () => {
  it('calculates subtotal with base price and zero-cost options without regex parsing', () => {
    const basePrice = 'Rp 25.000';
    const selectedVariants: VariantOption[] = [
      { label: 'Regular', priceModifier: 0 },
      { label: 'Normal Ice', priceModifier: 0 },
    ];
    const unitPrice = calculateItemPrice(basePrice, selectedVariants, []);
    assert.strictEqual(unitPrice, 25000);
    const subtotal = unitPrice * 3;
    assert.strictEqual(subtotal, 75000);
  });

  it('calculates subtotal with positive modifiers and addons dynamically', () => {
    const basePrice = 30000;
    const selectedVariants: (VariantOption | string)[] = [
      { label: 'Large', priceModifier: 6000 },
      'Extra Shot (+Rp 4.000)',
    ];
    const selectedAddons = [{ price: 5000 }, { price: 3000 }];
    const unitPrice = calculateItemPrice(basePrice, selectedVariants, selectedAddons);
    assert.strictEqual(unitPrice, 48000); // 30000 + 6000 + 4000 + 5000 + 3000
    const subtotal = unitPrice * 2;
    assert.strictEqual(subtotal, 96000);
  });
});

describe('Cart Item Quantity Stacking via Deterministic Hash', () => {
  interface MockCartItem {
    id: string;
    product: { id: number; name: string };
    quantity: number;
    totalPrice: number;
    selectedVariants: Record<string, string | VariantOption>;
    selectedAddons: string[];
  }

  it('stacks quantity and updates totalPrice for identical item hash', () => {
    const hash = buildCartItemHash(
      101,
      { Ukuran: { label: 'Large', priceModifier: 5000 }, Ice: 'Less' },
      ['Oatmilk']
    );

    const initialItem: MockCartItem = {
      id: hash,
      product: { id: 101, name: 'Kopi Susu' },
      quantity: 1,
      totalPrice: 28000,
      selectedVariants: { Ukuran: { label: 'Large', priceModifier: 5000 }, Ice: 'Less' },
      selectedAddons: ['Oatmilk'],
    };

    const cart = [initialItem];

    // Adding the identical combination (even if variant keys were specified in different order)
    const secondHash = buildCartItemHash(
      101,
      { Ice: 'Less', Ukuran: { label: 'Large', priceModifier: 5000 } },
      ['Oatmilk']
    );
    assert.strictEqual(hash, secondHash);

    const newItem: MockCartItem = {
      id: secondHash,
      product: { id: 101, name: 'Kopi Susu' },
      quantity: 2,
      totalPrice: 56000,
      selectedVariants: { Ice: 'Less', Ukuran: { label: 'Large', priceModifier: 5000 } },
      selectedAddons: ['Oatmilk'],
    };

    const updatedCart = stackCartItem(cart, newItem);

    assert.strictEqual(updatedCart.length, 1);
    assert.strictEqual(updatedCart[0].id, hash);
    assert.strictEqual(updatedCart[0].quantity, 3);
    assert.strictEqual(updatedCart[0].totalPrice, 84000);
  });

  it('creates separate line items when variant options differ', () => {
    const hashRegular = buildCartItemHash(101, { Ukuran: 'Regular' }, []);
    const hashLarge = buildCartItemHash(101, { Ukuran: { label: 'Large', priceModifier: 5000 } }, []);

    assert.notStrictEqual(hashRegular, hashLarge);

    const cart: MockCartItem[] = [
      {
        id: hashRegular,
        product: { id: 101, name: 'Kopi Susu' },
        quantity: 1,
        totalPrice: 20000,
        selectedVariants: { Ukuran: 'Regular' },
        selectedAddons: [],
      },
    ];

    const largeItem: MockCartItem = {
      id: hashLarge,
      product: { id: 101, name: 'Kopi Susu' },
      quantity: 1,
      totalPrice: 25000,
      selectedVariants: { Ukuran: { label: 'Large', priceModifier: 5000 } },
      selectedAddons: [],
    };

    const updatedCart = stackCartItem(cart, largeItem);

    assert.strictEqual(updatedCart.length, 2);
    assert.strictEqual(updatedCart[0].id, hashRegular);
    assert.strictEqual(updatedCart[0].quantity, 1);
    assert.strictEqual(updatedCart[1].id, hashLarge);
    assert.strictEqual(updatedCart[1].quantity, 1);

    // Stacking a second large item should only increment the large item
    const anotherLargeItem: MockCartItem = {
      id: hashLarge,
      product: { id: 101, name: 'Kopi Susu' },
      quantity: 3,
      totalPrice: 75000,
      selectedVariants: { Ukuran: { label: 'Large', priceModifier: 5000 } },
      selectedAddons: [],
    };

    const stackedCart = stackCartItem(updatedCart, anotherLargeItem);
    assert.strictEqual(stackedCart.length, 2);
    assert.strictEqual(stackedCart[0].quantity, 1);
    assert.strictEqual(stackedCart[1].quantity, 4);
    assert.strictEqual(stackedCart[1].totalPrice, 100000);
  });
});

describe('Safe Variant Label Extraction for Grid Displays', () => {
  const extractSafeVariantLabel = (product: { variants?: unknown }): string => {
    if (!product?.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
      return '1 Pack';
    }
    const first: unknown = product.variants[0];
    if (typeof first === 'string') {
      return (first ? first.replace(/\s*\(\s*[+-]?\s*(?:Rp\.?\s*)?[\d.,]+\s*\)/i, '').trim() : '') || '1 Pack';
    }
    if (first && typeof first === 'object') {
      if ('options' in first && Array.isArray(first.options) && first.options.length > 0) {
        const opt: unknown = first.options[0];
        if (typeof opt === 'string') {
          return opt.replace(/\s*\(\s*[+-]?\s*(?:Rp\.?\s*)?[\d.,]+\s*\)/i, '').trim() || '1 Pack';
        }
        if (opt && typeof opt === 'object' && 'label' in opt && typeof opt.label === 'string') {
          return opt.label.trim() || '1 Pack';
        }
      }
      if ('label' in first && typeof first.label === 'string') {
        return first.label.trim() || '1 Pack';
      }
      if ('name' in first && typeof first.name === 'string') {
        return first.name.trim() || '1 Pack';
      }
    }
    return '1 Pack';
  };

  it('extracts label from MenuItemVariant containing structured VariantOption objects', () => {
    const product = {
      variants: [
        {
          name: 'Ukuran',
          options: [
            { label: 'Medium', priceModifier: 3000 },
            { label: 'Large', priceModifier: 6000 },
          ],
        },
      ],
    };
    assert.strictEqual(extractSafeVariantLabel(product), 'Medium');
  });

  it('extracts label from MenuItemVariant containing legacy string options', () => {
    const product = {
      variants: [
        {
          name: 'Porsi',
          options: ['Family Pack (+Rp 15.000)', 'Single Pack'],
        },
      ],
    };
    assert.strictEqual(extractSafeVariantLabel(product), 'Family Pack');
  });

  it('extracts label from legacy flat array of string options', () => {
    const product = {
      variants: ['250 Gram (+Rp 5.000)', '500 Gram'],
    };
    assert.strictEqual(extractSafeVariantLabel(product), '250 Gram');
  });

  it('extracts label from flat array of structured VariantOption objects', () => {
    const product = {
      variants: [{ label: '100ml Bottle', priceModifier: 0 }],
    };
    assert.strictEqual(extractSafeVariantLabel(product), '100ml Bottle');
  });

  it('falls back to "1 Pack" when product has no variants or empty array', () => {
    assert.strictEqual(extractSafeVariantLabel({}), '1 Pack');
    assert.strictEqual(extractSafeVariantLabel({ variants: [] }), '1 Pack');
    assert.strictEqual(extractSafeVariantLabel({ variants: null }), '1 Pack');
  });
});

describe('Full WhatsApp Receipt String Output', () => {
  it('generates expected WhatsApp message with zero-cost and positive modifiers', () => {
    const clientName = 'Kopi Kenangan Senja';
    const cart = [
      {
        name: 'Kopi Susu Gula Aren',
        quantity: 2,
        totalPrice: 46000,
        selectedVariants: {
          Ukuran: { label: 'Large', priceModifier: 5000 },
          Es: 'Normal Ice',
        },
        selectedAddons: ['Extra Espresso'],
        notes: 'Gula sedikit saja',
      },
      {
        name: 'Croissant Cokelat',
        quantity: 1,
        totalPrice: 20000,
        selectedVariants: {
          Suhu: { label: 'Hangat', priceModifier: 0 },
        },
        selectedAddons: [],
        notes: '',
      },
    ];

    let message = `Halo ${clientName}, saya ingin memesan:\n\n`;
    cart.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* (x${item.quantity})\n`;
      const variantEntries = Object.entries(item.selectedVariants);
      if (variantEntries.length > 0) {
        const text = variantEntries
          .map(([k, v]) => formatVariantOptionDisplay(k, v))
          .join(', ');
        message += `   Variasi: ${text}\n`;
      }
      if (item.selectedAddons.length > 0) {
        message += `   Tambahan: ${item.selectedAddons.join(', ')}\n`;
      }
      if (item.notes) {
        message += `   Catatan: _${item.notes}_\n`;
      }
      message += `   Harga: Rp ${item.totalPrice.toLocaleString('id-ID')}\n\n`;
    });

    assert.match(message, /1\. \*Kopi Susu Gula Aren\* \(x2\)/);
    assert.match(message, /Variasi: Ukuran: Large \(\+Rp 5\.000\), Es: Normal Ice/);
    assert.match(message, /2\. \*Croissant Cokelat\* \(x1\)/);
    assert.match(message, /Variasi: Suhu: Hangat/);
    assert.doesNotMatch(message, /Suhu: Hangat \(\+Rp 0\)/);
  });
});
