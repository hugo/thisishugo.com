import type {DataLoader} from '@remix-run/core'

const loader: DataLoader = async () => {
  return {
    date: new Date(),
  }
}

export = loader
