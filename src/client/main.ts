import type {Runtime} from 'foldkit'
import type {UrlRequest} from 'foldkit/navigation'
import type {Url} from 'foldkit/url'

import {Message} from './message.ts'
import type {Model} from './model.ts'
import {urlToAppRoute} from './route.ts'
import {Toast} from './toast.ts'

export const init: Runtime.RoutingApplicationInit<Model, Message> = (url) => ({
  model: {
    route: urlToAppRoute(url),
    toast: Toast.init({id: 'toast', defaultDuration: '2 seconds'}),
  },
})

export const routing = {
  onUrlRequest: (request: UrlRequest) => Message.ClickedLink({request}),
  onUrlChange: (url: Url) => Message.ChangedUrl({url}),
}
