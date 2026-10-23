import {NodeRuntime} from '@effect/platform-node'
import {Layer} from 'effect'

import {DevelopmentServer} from './development.ts'

NodeRuntime.runMain(Layer.launch(DevelopmentServer))
