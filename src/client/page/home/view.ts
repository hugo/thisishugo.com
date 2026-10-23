import type {Html, HtmlBuilder} from 'foldkit/html'

import {Message} from '../../message.ts'
import {EMAIL} from '../../site.ts'
import {
  HEADLINE_CLASSES,
  LINK_CLASSES,
  LINK_LIST_CLASSES,
  PROSE_CLASSES,
} from '../style.ts'
import * as Icon from './icon.ts'

const GITHUB_URL = 'https://github.com/hugo'

const LINK_ROW_CLASSES = 'flex flex-wrap items-center gap-2'

const emailRow = (h: HtmlBuilder<Message>) =>
  h.li(
    [h.Class(LINK_ROW_CLASSES)],
    [
      h.a(
        [h.Class(LINK_CLASSES), h.Href(`mailto:${EMAIL}`)],
        [Icon.envelope(h), h.span([h.Id('email-address')], [EMAIL])]
      ),
      h.button(
        [
          h.Type('button'),
          h.AriaLabel('Copy email address'),
          h.Class(
            'inline-flex cursor-pointer items-center p-1 text-muted hover:text-accent focus-visible:text-accent'
          ),
          h.OnClick(Message.ClickedCopyEmail()),
        ],
        [Icon.clipboard(h)]
      ),
    ]
  )

export const view = (h: HtmlBuilder<Message>): ReadonlyArray<Html> => [
  h.h1([h.Class(HEADLINE_CLASSES)], ['Hello, this is Hugo']),
  h.p(
    [h.Class(PROSE_CLASSES)],
    ['I talk to computers. Sometimes they listen.']
  ),
  h.ul(
    [h.Class(LINK_LIST_CLASSES)],
    [
      h.li(
        [h.Class(LINK_ROW_CLASSES)],
        [
          h.a(
            [
              h.Class(LINK_CLASSES),
              h.Href(GITHUB_URL),
              h.Target('_blank'),
              h.Rel('noopener noreferrer'),
            ],
            [Icon.github(h), 'github.com/hugo']
          ),
        ]
      ),
      emailRow(h),
    ]
  ),
]
