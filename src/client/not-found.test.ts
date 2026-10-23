import {beforeAll, expect, test} from 'vitest'
import {page, userEvent} from 'vitest/browser'

import {runApp} from './test-app.ts'

beforeAll(() => runApp('/nope'))

const copyButton = page.getByRole('button', {name: 'Copy email address'})

test('an unknown address renders the not-found page, whose only link leads home', async () => {
  await expect.element(copyButton).not.toBeInTheDocument()
  await userEvent.click(page.getByRole('link'))
  await expect.element(copyButton).toBeVisible()
  expect(window.location.pathname).toBe('/')
})
