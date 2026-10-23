import {defineMessageUnion} from 'foldkit/message'
import {UrlRequest} from 'foldkit/navigation'
import {Url} from 'foldkit/url'

import {Toast} from './toast.ts'

export const Message = defineMessageUnion({
  ClickedLink: {request: UrlRequest},
  ChangedUrl: {url: Url},
  CompletedNavigateInternal: {},
  CompletedLoadExternal: {},
  ClickedCopyEmail: {},
  SucceededCopyEmail: {},
  FailedCopyEmail: {},
  CompletedSelectEmail: {},
  GotToastMessage: {message: Toast.Message},
})
export type Message = typeof Message.Type
