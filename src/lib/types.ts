export type PackageTier =
  | 'free'
  | 'free_trial'
  | 'instant'
  | 'instan'
  | 'pro'
  | 'pro-basic'
  | 'pro-advanced'
  | 'enterprise'

export interface VariantOption {
  label: string
  priceModifier: number
}

export interface SpecificationItem {
  label: string
  value: string
}
