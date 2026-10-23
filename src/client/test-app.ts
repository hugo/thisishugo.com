import {Clipboard} from '@effect/platform-browser'
import {Runtime} from 'foldkit'
import {vi} from 'vitest'
import {page} from 'vitest/browser'

import {init, routing} from './main.ts'
import {Model} from './model.ts'
import {update} from './update.ts'
import {view} from './view.ts'
import './styles.css'

export const runApp = async (path = '/'): Promise<void> => {
  window.history.replaceState(null, '', path)
  const container = document.createElement('div')
  container.id = 'root'
  document.body.append(container)
  Runtime.run(
    Runtime.makeApplication({
      Model,
      resources: Clipboard.layer,
      init,
      routing,
      update,
      view,
      container,
      devTools: false,
    })
  )
  await vi.waitFor(() => page.getByRole('main').element())
}
