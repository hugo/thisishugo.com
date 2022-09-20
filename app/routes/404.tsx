import {type MetaFunction} from '@remix-run/node'

export let meta: MetaFunction = () => ({title: 'Not Found'})

export default function FourZeroFour() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <h1>404 :(</h1>
    </div>
  )
}
