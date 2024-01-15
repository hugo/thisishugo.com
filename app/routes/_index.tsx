import type {MetaFunction} from '@remix-run/node'
import type {AnchorHTMLAttributes} from 'react'
import {twJoin} from 'tailwind-merge'

export let meta: MetaFunction = ({matches}) => [
  ...matches.flatMap(({meta = []}) => meta),
  {title: 'Hugo Jobling'},
]

export default function Index() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden p-4">
      <div className="overflow-y-auto rounded border-2 border-solid border-gray-700">
        <div className="bg-gray-100">
          <div className="flex flex-col items-center justify-around gap-4 p-4">
            <img
              src="/images/hugo.jpg"
              className="rounded-full border-2 border-solid border-gray-700"
              width="128"
              height="128"
              alt="profile of hugo"
            />

            <a
              href="mailto:hello@thisishugo.com"
              className="text-sm text-pink-400 underline md:text-2xl hover:text-pink-500 transition-colors"
            >
              hello@thisishugo.com
            </a>

            <div className="flex w-full flex-col items-center justify-center gap-2">
              <Link
                className="border-twitter text-twitter hover:bg-twitter hover:text-white"
                href="https://twitter.com/dissimile"
              >
                Twitter
              </Link>
              <Link
                className="border-medium p-1 text-medium hover:bg-medium hover:text-white"
                href="https://words.thisishugo.com"
              >
                Medium
              </Link>
              <Link
                className="border-black text-black hover:bg-black hover:text-white"
                href="https://github.com/hugo"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Link({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={twJoin(
        'block w-full rounded border-2 border-solid text-center text-sm md:text-lg p-1 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
