import {Clipboard} from '@effect/platform-browser'
import {Runtime} from 'foldkit'

import {init, routing} from './main.ts'
import {Message} from './message.ts'
import {Model} from './model.ts'
import {update} from './update.ts'
import {view} from './view.ts'
import './styles.css'

const application = Runtime.makeApplication({
  Model,
  resources: Clipboard.layer,
  init,
  routing,
  update,
  view,
  container: document.getElementById('root'),
  devTools: {Message},
})

Runtime.hydrate(application)
