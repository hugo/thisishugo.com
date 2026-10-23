import {createServer} from 'node:http'

import {NodeHttpServer} from '@effect/platform-node'
import {Config} from 'effect'

export const Listen = NodeHttpServer.layerConfig(createServer, {
  port: Config.Port('PORT').pipe(Config.withDefault(3000)),
})
