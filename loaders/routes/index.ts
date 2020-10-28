import type {DataLoader} from '@remix-run/core'

const loader: DataLoader = async () => {
  return {
    message: 'this is awesome 😎',
  }
}

export = loader
