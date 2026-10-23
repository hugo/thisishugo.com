import {expect, test} from 'vitest'

import styles from './styles.css?raw'

/** Reads a `--color-*` token out of the stylesheet. */
const token = (name: string): string => {
  const found = new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'u').exec(
    styles
  )?.[1]
  if (found === undefined) {
    throw new Error(`--color-${name} is not declared in styles.css`)
  }
  return found
}

/** WCAG 2.x contrast ratio between two hex colours. */
const contrast = (a: string, b: string) => {
  const channel = (hex: string, at: number) =>
    Number.parseInt(hex.slice(at, at + 2), 16)
  const linear = (byte: number) => {
    const c = byte / 255
    if (c <= 0.04045) {
      return c / 12.92
    }
    return ((c + 0.055) / 1.055) ** 2.4
  }
  const luminance = (hex: string) =>
    0.2126 * linear(channel(hex, 1)) +
    0.7152 * linear(channel(hex, 3)) +
    0.0722 * linear(channel(hex, 5))
  const [l1, l2] = [luminance(a), luminance(b)]
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

test.each(['fg', 'muted', 'accent'])(
  '--color-%s clears WCAG AA against the background',
  (name) => {
    expect(contrast(token(name), token('bg'))).toBeGreaterThan(4.5)
  }
)
