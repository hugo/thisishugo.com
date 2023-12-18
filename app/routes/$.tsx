import {type LoaderFunction, type MetaFunction} from '@remix-run/node'

export let meta: MetaFunction = () => [{title: 'Not Found'}]

export let loader: LoaderFunction = () => {
  return new Response(null, {status: 404})
}

export default function FourZeroFour() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="px-20 py-10 bg-white rounded-lg">
        <h1>404 :(</h1>
      </div>
    </div>
  )
}
