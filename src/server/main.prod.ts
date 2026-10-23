import {NodeRuntime} from '@effect/platform-node'
import {Layer} from 'effect'

import {ProductionServer} from './production.ts'

NodeRuntime.runMain(Layer.launch(ProductionServer))
