import React from 'react'
import ReactDOM from 'react-dom'
import Remix from '@remix-run/react/browser'

import App from './App'

ReactDOM.hydrate(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <Remix>
    <App />
  </Remix>,
  document
)
