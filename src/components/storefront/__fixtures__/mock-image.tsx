import type { ComponentProps } from 'react'

export interface MockImageProps extends ComponentProps<'img'> {
  fill?: boolean
  priority?: boolean
}

export default function MockNextImage({
  fill: _fill,
  priority: _priority,
  ...props
}: MockImageProps) {
  // eslint-disable-next-line @next/next/no-img-element -- mock component for test environment
  return <img {...props} />
}
