/**
 * Helper to check if a template section is visible based on hiddenSections list. Supports
 * cross-template aliases (e.g. gallery <-> lookbook, reviews <-> testimoni, menu <-> katalog).
 */
export function isSectionVisible(sectionId: string, hiddenSections?: string[]): boolean {
  if (!hiddenSections || !hiddenSections.length) return true
  if (hiddenSections.includes(sectionId)) return false

  if (
    (sectionId === 'gallery' || sectionId === 'lookbook') &&
    (hiddenSections.includes('gallery') || hiddenSections.includes('lookbook'))
  ) {
    return false
  }
  if (
    (sectionId === 'reviews' || sectionId === 'testimoni') &&
    (hiddenSections.includes('reviews') || hiddenSections.includes('testimoni'))
  ) {
    return false
  }
  if (
    (sectionId === 'menu' || sectionId === 'katalog' || sectionId === 'catalog' || sectionId === 'products') &&
    (hiddenSections.includes('menu') || hiddenSections.includes('katalog') || hiddenSections.includes('catalog') || hiddenSections.includes('products'))
  ) {
    return false
  }
  if (
    (sectionId === 'hours' || sectionId === 'operatingHours' || sectionId === 'operating-hours') &&
    (hiddenSections.includes('hours') || hiddenSections.includes('operatingHours') || hiddenSections.includes('operating-hours'))
  ) {
    return false
  }
  return true
}
