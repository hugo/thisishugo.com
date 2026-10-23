import {Match} from 'effect'
import {expect, test} from 'vitest'

import {DEV_STYLESHEET, renderDocument, renderPage, statusFor} from './entry.ts'

const application: Parameters<typeof renderDocument>[0] = {
  html: '<div data-foldkit-app="app" data-foldkit-build="test"></div>',
  title: 'Hugo Jobling',
  canonical: 'https://thisishugo.com',
  ogUrl: 'https://thisishugo.com',
}

const documentWith = (stylesheets: ReadonlyArray<string>) =>
  renderDocument(application, {
    entryScript: '/assets/app.js',
    stylesheets,
    modulePreloads: [],
  })

const statusOf = async (request: Request) => {
  const result = await renderPage(request)
  return Match.valueTags(result, {
    Rendered: () => 200,
    Responded: ({response}) => response.status,
  })
}

test('the dev server links the source stylesheet', () => {
  expect(documentWith([])).toContain(`href="${DEV_STYLESHEET}"`)
})

test('a build links its own stylesheet', () => {
  expect(documentWith(['/assets/app.css'])).not.toContain(DEV_STYLESHEET)
})

test.each(['https://thisishugo.com/', 'https://thisishugo.com/index.html'])(
  '%s is the home page',
  (url) => {
    expect(statusFor(url)).toBe(200)
  }
)

test('any other path is not found', () => {
  expect(statusFor('https://thisishugo.com/nope')).toBe(404)
})

test('methods other than GET and HEAD are not allowed', async () => {
  expect(
    await statusOf(new Request('https://thisishugo.com/', {method: 'POST'}))
  ).toBe(405)
})
