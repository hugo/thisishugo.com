import type {MetaFunction} from '@remix-run/node'
import type {AnchorHTMLAttributes} from 'react'
import {twMerge} from 'tailwind-merge'

export let meta: MetaFunction = ({matches}) => [
  ...matches.flatMap(({meta = []}) => meta),
  {title: 'Hugo Jobling'},
]

export default function Index() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden">
      <div className="overflow-y-auto rounded-sm border-2 border-solid border-gray-700">
        <div className="bg-gray-100">
          <div className="flex flex-col items-center justify-around gap-2 p-2">
            <div className="flex flex-col items-center gap-1">
              <p className="text-md">Hello, this is Hugo</p>
            </div>

            <img
              src="/images/hugo.jpg"
              className="rounded-full border-2 border-solid border-gray-700"
              width="128"
              height="128"
              alt="profile of hugo"
            />

            <a
              href="mailto:hello@thisishugo.com"
              className="text-lg text-gray-800 underline transition-colors hover:text-gray-500"
            >
              hello@thisishugo.com
            </a>

            <div className="flex w-full flex-col items-center justify-center gap-2">
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
      className={twMerge(
        'block w-full rounded-sm border-2 border-solid p-1 text-center text-xs transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
