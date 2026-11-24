import { describe, expect, it } from 'vitest'

import { generateSlug } from './utils'

describe('generateSlug', () => {
  it('converts uppercase to lowercase', () => {
    expect(generateSlug('TOKO KOPI MANTAP')).toBe('toko-kopi-mantap')
  })

  it('converts spaces to hyphens', () => {
    expect(generateSlug('kopi susu gula aren')).toBe('kopi-susu-gula-aren')
  })

  it('strips special characters and punctuation', () => {
    expect(generateSlug('Warung Bu Ani & Pak Budi! (100% Halal)')).toBe(
      'warung-bu-ani-pak-budi-100-halal',
    )
  })

  it('collapses multiple spaces or hyphens', () => {
    expect(generateSlug('toko   ---   keren')).toBe('toko-keren')
  })

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug(' -  toko berkah  - ')).toBe('toko-berkah')
  })

  it('handles empty input', () => {
    expect(generateSlug('')).toBe('')
  })
})
