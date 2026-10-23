import {Schema} from 'effect'

import {AppRoute} from './route.ts'
import {Toast} from './toast.ts'

export const Model = Schema.Struct({route: AppRoute, toast: Toast.Model})
export type Model = typeof Model.Type
