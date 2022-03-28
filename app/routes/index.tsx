import type {MetaFunction} from 'remix'

export let meta: MetaFunction = () => ({
  title: 'Hugo Jobling',
})

export default function Index() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center overflow-hidden p-4">
      <div className="overflow-y-auto border-2 border-solid border-gray-700 rounded">
        <div className="bg-gray-100 pt-24">
          <div className="flex flex-col justify-around items-center py-2 px-12">
            <img
              src="/images/hugo.jpg"
              className="-mt-20 rounded-full border-2 border-solid border-blue-900"
              width="128"
              height="128"
              alt="profile of hugo"
            />

            <h1 className="text-xl md:text-3xl m-1 md:m-2">
              Hello, this is Hugo
            </h1>

            <a
              href="mailto:hello@thisishugo.com"
              className="text-blue-700 underline text-l md:text-xl m-1 md:m-2"
            >
              hello@thisishugo.com
            </a>

            <hr className="border border-blue-600 border-solid w-full m-2" />

            <div className="w-full p-2 flex flex-col justify-center items-center">
              <a
                className="text-twitter border-2 border-solid border-twitter hover:bg-twitter hover:text-white w-full m-2 block py-1 text-center rounded"
                href="https://twitter.com/dissimile"
              >
                Twitter
              </a>
              <a
                className="text-medium border-2 border-solid border-medium hover:bg-medium hover:text-white w-full m-2 block py-1 text-center rounded"
                href="https://words.thisishugo.com"
              >
                Medium
              </a>
              <a
                className="text-black border-2 border-solid border-black hover:bg-black hover:text-white w-full m-2 block py-1 text-center rounded"
                href="https://github.com/hugo"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
