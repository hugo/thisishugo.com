import {render, screen} from '@testing-library/react'

import Index from './index'

test('welcome message', () => {
  render(<Index />)
  const subject = screen.getByText('Hello, this is Hugo')

  expect(subject).toBeInTheDocument()
})

test('photo', () => {
  render(<Index />)

  const subject = screen.getByAltText('profile of hugo')

  expect(subject).toHaveAttribute('src', '/images/hugo.jpg')
})

test('email', () => {
  render(<Index />)

  const email = 'hello@thisishugo.com'
  const subject = screen.getByText(email)

  expect(subject).toHaveAttribute('href', `mailto:${email}`)
})
