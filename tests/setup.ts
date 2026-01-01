import {afterEach, expect} from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import {cleanup} from '@testing-library/react'

// Ensure DOM is cleaned between tests when globals are disabled
afterEach(() => cleanup())

expect.extend(matchers)
