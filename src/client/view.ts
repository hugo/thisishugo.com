import type {Document, Html, HtmlBuilder} from 'foldkit/html'

import {Message} from './message.ts'
import type {Model} from './model.ts'
import {Home, NotFound} from './page/index.ts'
import {pictureHtml} from './photo.ts'
import {AppRoute} from './route.ts'
import {ORIGIN, TITLE} from './site.ts'
import {Toast} from './toast.ts'

const frame = (
  model: Model,
  content: ReadonlyArray<Html>,
  h: HtmlBuilder<Message>
) =>
  h.div(
    [h.Class('fixed inset-0 h-dvh overflow-auto bg-accent')],
    [
      h.submodel({
        slotId: model.toast.id,
        model: model.toast,
        view: Toast.view,
        viewInputs: {
          position: 'BottomCenter',
          containerClassName: 'pb-safe-bottom',
          entryToView: (entry) =>
            h.p(
              [
                h.Class(
                  'rounded-md bg-fg px-4 py-2 font-mono text-sm text-bg shadow-lg'
                ),
              ],
              [entry.payload]
            ),
        },
        toParentMessage: (message) => Message.GotToastMessage({message}),
      }),
      h.div(
        [h.Class('flex h-full flex-col md:h-auto md:flex-row xl:bg-bg')],
        [
          h.div([
            h.Class(
              'relative min-h-12 shrink grow basis-1/2 bg-accent md:min-w-0 md:shrink-0 md:grow-0 xl:flex-1'
            ),
            h.InnerHTML(pictureHtml),
          ]),
          h.main(
            [
              h.Class(
                'flex min-h-1/2 shrink-0 grow-0 items-center bg-bg pt-8 pb-safe-bottom pl-safe-left pr-safe-right md:min-h-dvh md:min-w-0 md:basis-1/2 xl:w-lg xl:flex-none xl:basis-auto md:pt-safe-top'
              ),
            ],
            [h.div([h.Class('mx-auto w-full max-w-lg')], content)]
          ),
          h.div([h.Class('hidden xl:block xl:flex-1')]),
        ]
      ),
    ]
  )

export const view = (model: Model, h: HtmlBuilder<Message>): Document =>
  AppRoute.match(model.route, {
    Home: () => ({
      title: TITLE,
      canonical: ORIGIN,
      body: frame(model, Home.view(h), h),
    }),
    NotFound: () => ({
      title: `Not found · ${TITLE}`,
      body: frame(model, NotFound.view(h), h),
    }),
  })
