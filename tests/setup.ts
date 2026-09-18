import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/react'
import {afterEach} from 'vitest'

// Ensure DOM is cleaned between tests when globals are disabled
afterEach(() => {
  cleanup()
})
