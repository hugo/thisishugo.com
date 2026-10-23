import {beforeAll, expect, test} from 'vitest'
import {page} from 'vitest/browser'

import {runApp} from './test-app.ts'

beforeAll(() => runApp('/'))

test('the vendored faces load', async () => {
  await document.fonts.load('16px "Source Sans 3"')
  await document.fonts.load('16px "Source Code Pro"')
  expect(document.fonts.check('16px "Source Sans 3"')).toBe(true)
  expect(document.fonts.check('16px "Source Code Pro"')).toBe(true)
})

const photo = () =>
  page.getByRole('presentation').element().getBoundingClientRect()
const main = () => page.getByRole('main').element().getBoundingClientRect()

const stacked = () => photo().bottom <= main().top + 1

test('767px stacks the photo above the content', async () => {
  await page.viewport(767, 900)
  expect(stacked()).toBe(true)
  expect(main().width).toBe(767)
})

test('768px places the photo and content side by side, half each', async () => {
  await page.viewport(768, 900)
  expect(stacked()).toBe(false)
  expect(photo().width).toBe(384)
  expect(main().width).toBe(384)
})

test('1279px still splits the viewport in half', async () => {
  await page.viewport(1279, 900)
  expect(main().width).toBe(639.5)
})

test('1280px caps the content column at 32rem with equal outer columns', async () => {
  await page.viewport(1280, 900)
  expect(main().width).toBe(512)
  expect(photo().width).toBe(384)
  expect(main().left).toBe(384)
})
