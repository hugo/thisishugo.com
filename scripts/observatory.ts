import {NodeRuntime, NodeServices} from '@effect/platform-node'
import {Config, Console, Effect, Layer, Option, Schema} from 'effect'
import * as FileSystem from 'effect/FileSystem'
import {FetchHttpClient, HttpClient, HttpClientResponse} from 'effect/http'

const HOST = 'thisishugo.com'
const REQUIRED_GRADE = 'A+'

const Scan = Schema.Struct({grade: Schema.String, score: Schema.Number})

class GradeBelowRequirement extends Schema.TaggedError<GradeBelowRequirement>()(
  'GradeBelowRequirement',
  {grade: Schema.String, score: Schema.Number}
) {
  override get message(): string {
    return `${HOST} scored ${this.grade} (${this.score}); ${REQUIRED_GRADE} is required`
  }
}

const program = Effect.gen(function* () {
  const client = (yield* HttpClient.HttpClient).pipe(HttpClient.filterStatusOk)
  const scan = yield* client
    .post('https://observatory-api.mdn.mozilla.net/api/v2/scan', {
      urlParams: {host: HOST},
    })
    .pipe(Effect.flatMap(HttpClientResponse.schemaBodyJson(Scan)))

  const report = `## Mozilla Observatory: ${scan.grade} (${scan.score})\n\nhttps://developer.mozilla.org/en-US/observatory/analyze?host=${HOST}\n`
  yield* Console.log(report)

  const maybeSummary = yield* Config.option(
    Config.String('GITHUB_STEP_SUMMARY')
  )
  yield* Option.match(maybeSummary, {
    onNone: () => Effect.void,
    onSome: (path) =>
      FileSystem.FileSystem.use((fs) =>
        fs.writeFileString(path, report, {flag: 'a'})
      ),
  })

  if (scan.grade !== REQUIRED_GRADE) {
    return yield* new GradeBelowRequirement(scan)
  }
  return scan
})

NodeRuntime.runMain(
  program.pipe(
    Effect.provide(Layer.mergeAll(FetchHttpClient.layer, NodeServices.layer))
  )
)
