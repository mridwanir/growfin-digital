export function getRenderedRgb(color: string, background?: string): [number, number, number] {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable')
  }

  if (background) {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, 1, 1)
  }

  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)

  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

export function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(val => {
    const s = val / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getContrastRatio(foreground: string, background: string): number {
  const fgRgb = getRenderedRgb(foreground, background)
  const bgRgb = getRenderedRgb(background)
  const l1 = getLuminance(fgRgb)
  const l2 = getLuminance(bgRgb)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}
