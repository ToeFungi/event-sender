/**
 * Non-fatal error indicating that no events have been scheduled
 */
class NoScheduledEventsError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export { NoScheduledEventsError }
