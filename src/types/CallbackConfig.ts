/**
 * Representation of the callback configuration with the scheduled event
 */
interface CallbackConfig {
  url: string
  headers?: {
    [name: string]: string
  }
  type: string
}

export { CallbackConfig }
