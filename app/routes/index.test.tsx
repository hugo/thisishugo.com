import {render} from '@testing-library/react'

import Index from './index'

test('welcome message', () => {
  const {getByText} = render(<Index />)
  const subject = getByText('Hello, this is Hugo')

  expect(subject).toBeInTheDocument()
})

test('photo', () => {
  const {getByAltText} = render(<Index />)

  const subject = getByAltText('profile of hugo')

  expect(subject).toHaveAttribute('src', '/images/hugo.jpg')
})

test('email', () => {
  const {getByText} = render(<Index />)

  const email = 'hello@thisishugo.com'
  const subject = getByText(email)

  expect(subject).toHaveAttribute('href', `mailto:${email}`)
})
