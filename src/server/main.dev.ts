import {NodeRuntime} from '@effect/platform-node'
import {Layer} from 'effect'

import {DevelopmentServer} from './development.ts'
import {Logging} from './logging.ts'

NodeRuntime.runMain(
  Layer.launch(DevelopmentServer.pipe(Layer.provide(Logging)))
)
