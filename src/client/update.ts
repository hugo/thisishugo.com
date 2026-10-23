import type {Clipboard} from '@effect/platform-browser'
import {Option} from 'effect'
import {Update} from 'foldkit'
import {UrlRequest} from 'foldkit/navigation'
import {modifyFields} from 'foldkit/struct'
import {toString as urlToString} from 'foldkit/url'

import {
  CopyEmail,
  LoadExternal,
  NavigateInternal,
  SelectEmail,
} from './command.ts'
import {Message} from './message.ts'
import type {Model} from './model.ts'
import {urlToAppRoute} from './route.ts'
import {Toast} from './toast.ts'

const foldToastOutMessage = Toast.OutMessage.match<
  (model: Model) => Update.Return<Model, Message>
>({
  DismissedToast: () => (model) => ({model}),
})

const foldToast = Update.foldChild({
  update: Toast.update,
  read: (model: Model) => Option.some(model.toast),
  write: (model, nextToast) => modifyFields(model, {toast: () => nextToast}),
  toParentMessage: (message) => Message.GotToastMessage({message}),
  foldOutMessage: foldToastOutMessage,
})

const foldToastShow = Update.foldChild({
  update: Toast.show,
  read: (model: Model) => Option.some(model.toast),
  write: (model, nextToast) => modifyFields(model, {toast: () => nextToast}),
  toParentMessage: (message) => Message.GotToastMessage({message}),
  foldOutMessage: foldToastOutMessage,
})

export const update = (model: Model, message: Message) =>
  Message.match<Update.Return<Model, Message, Clipboard.Clipboard>>(message, {
    ClickedLink: ({request}) =>
      UrlRequest.match<Update.Return<Model, Message>>(request, {
        Internal: ({url}) => ({
          model,
          commands: [NavigateInternal({url: urlToString(url)})],
        }),
        External: ({href}) => ({model, commands: [LoadExternal({href})]}),
      }),
    ChangedUrl: ({url}) => ({
      model: modifyFields(model, {route: () => urlToAppRoute(url)}),
    }),
    CompletedNavigateInternal: () => ({model}),
    CompletedLoadExternal: () => ({model}),
    ClickedCopyEmail: () => ({model, commands: [CopyEmail()]}),
    SucceededCopyEmail: () =>
      foldToastShow(model, {payload: 'Email copied', variant: 'Success'}),
    FailedCopyEmail: () => ({model, commands: [SelectEmail()]}),
    CompletedSelectEmail: () => ({model}),
    GotToastMessage: ({message: toastMessage}) =>
      foldToast(model, toastMessage),
  })
