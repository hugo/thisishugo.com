import type {Html, HtmlBuilder} from 'foldkit/html'

import type {Message} from '../../message.ts'
import {homeRouter} from '../../route.ts'
import {
  HEADLINE_CLASSES,
  LINK_CLASSES,
  LINK_LIST_CLASSES,
  PROSE_CLASSES,
} from '../style.ts'

export const view = (h: HtmlBuilder<Message>): ReadonlyArray<Html> => [
  h.h1([h.Class(HEADLINE_CLASSES)], ['Hello, you seem lost']),
  h.p([h.Class(PROSE_CLASSES)], ['There is nothing here but you.']),
  h.ul(
    [h.Class(LINK_LIST_CLASSES)],
    [
      h.li(
        [],
        [
          h.a(
            [h.Class(LINK_CLASSES), h.Href(homeRouter())],
            ['Go somewhere else']
          ),
        ]
      ),
    ]
  ),
]
