import {NodeRuntime} from '@effect/platform-node'
import {Layer} from 'effect'

import {SecurityPolicy} from './policy.ts'
import {ProductionServer} from './production.ts'

NodeRuntime.runMain(
  Layer.launch(ProductionServer.pipe(Layer.provide(SecurityPolicy.production)))
)
