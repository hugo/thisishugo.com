import type {LoaderFunction, MetaFunction} from 'react-router'

export let meta: MetaFunction = () => [{title: 'Not Found'}]

export let loader: LoaderFunction = () => {
  return new Response(null, {status: 404})
}

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="rounded-lg bg-white px-20 py-10">
        <h1>404 :(</h1>
      </div>
    </div>
  )
}
