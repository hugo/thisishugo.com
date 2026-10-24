import {Logger} from 'effect'

// NOTE: One layer for the server and for the Foldkit Vite plugin, which runs its own Effect programs.
export const Logging = Logger.layer([Logger.consoleJson])
