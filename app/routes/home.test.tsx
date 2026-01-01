import {test, expect} from 'vitest'
import {render, screen} from '@testing-library/react'

import Home from './home'

test('photo', () => {
  render(<Home />)

  const subject = screen.getByAltText('profile of hugo')

  expect(subject).toHaveAttribute('src', '/images/hugo.jpg')
})

test('email', () => {
  render(<Home />)

  const email = 'hello@thisishugo.com'
  const subject = screen.getByText(email)

  expect(subject).toHaveAttribute('href', `mailto:${email}`)
})
