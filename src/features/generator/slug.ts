import crypto from 'node:crypto'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function generateTenantSlug(name: string): string {
  const base = slugify(name)
  const randomSuffix = crypto.randomBytes(3).toString('hex').slice(0, 5)

  return `${base || 'store'}-${randomSuffix}`
}

export function generateCategorySlug(name: string, index: number): string {
  const base = slugify(name)
  return base || `category-${index + 1}`
}
