import {NodeRuntime} from '@effect/platform-node'
import {Layer} from 'effect'

import {DevelopmentServer} from './development.ts'
import {SecurityPolicy} from './policy.ts'

NodeRuntime.runMain(
  Layer.launch(
    DevelopmentServer.pipe(Layer.provide(SecurityPolicy.development))
  )
)
