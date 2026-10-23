import {beforeAll, expect, test} from 'vitest'
import {commands, page, userEvent} from 'vitest/browser'

import {EMAIL} from './site.ts'
import {runApp} from './test-app.ts'

declare module 'vitest/browser' {
  interface BrowserCommands {
    grantClipboard: () => Promise<void>
    revokePermissions: () => Promise<void>
  }
}

beforeAll(() => runApp('/'))

const copyButton = page.getByRole('button', {name: 'Copy email address'})
const toast = page.getByText('Email copied')

test('with clipboard permission, the address is copied and a toast confirms it', async () => {
  await commands.grantClipboard()
  await userEvent.click(copyButton)
  await expect.element(toast).toBeVisible()
  expect(await navigator.clipboard.readText()).toBe(EMAIL)
})

test('without clipboard permission, the address is selected and no toast appears', async () => {
  await commands.revokePermissions()
  await expect.element(toast).not.toBeInTheDocument()
  await userEvent.click(copyButton)
  await expect.poll(() => window.getSelection()?.toString()).toBe(EMAIL)
  await expect.element(toast).not.toBeInTheDocument()
})
