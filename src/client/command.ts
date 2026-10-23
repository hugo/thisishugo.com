import {Clipboard} from '@effect/platform-browser'
import {Effect, Schema} from 'effect'
import {Command} from 'foldkit'
import {load, pushUrl} from 'foldkit/navigation'

import {Message} from './message.ts'
import {EMAIL} from './site.ts'

// NOTE: Foldkit Dom has no text-selection operation; browser access stays inside this Effect adapter.
const selectEmail = Effect.gen(function* () {
  const email = yield* Effect.fromNullishOr(
    document.getElementById('email-address')
  )
  const selection = yield* Effect.fromNullishOr(window.getSelection())
  const range = document.createRange()
  range.selectNodeContents(email)
  selection.removeAllRanges()
  selection.addRange(range)
})

export const NavigateInternal = Command.define('NavigateInternal', {
  args: {url: Schema.String},
  messages: [Message.CompletedNavigateInternal],
  execute: ({url}) =>
    pushUrl(url).pipe(Effect.as(Message.CompletedNavigateInternal())),
})

export const LoadExternal = Command.define('LoadExternal', {
  args: {href: Schema.String},
  messages: [Message.CompletedLoadExternal],
  execute: ({href}) =>
    load(href).pipe(Effect.as(Message.CompletedLoadExternal())),
})

export const CopyEmail = Command.define('CopyEmail', {
  messages: [Message.SucceededCopyEmail, Message.FailedCopyEmail],
  execute: Clipboard.Clipboard.use((clipboard) =>
    clipboard.writeString(EMAIL)
  ).pipe(
    Effect.as(Message.SucceededCopyEmail()),
    Effect.catch(() => Effect.succeed(Message.FailedCopyEmail()))
  ),
})

export const SelectEmail = Command.define('SelectEmail', {
  messages: [Message.CompletedSelectEmail],
  execute: selectEmail.pipe(
    Effect.ignore,
    Effect.as(Message.CompletedSelectEmail())
  ),
})
