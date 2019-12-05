import { SchedulerService } from './services/SchedulerService'
import { NoScheduledEventsError } from './errors/NoScheduledEventsError'

/**
 * Controller is the orchestration layer for retrieving and publishing events
 */
class Controller {
  constructor(protected schedulerService: SchedulerService) {
  }

  /**
   * Entry point into sender, gets the current time and attempts to get the scheduled events and publish them
   */
  public handler(event: any): Promise<void> {
    /**
     * Tap and log response error
     */
    const tapResponse = (): void => console.log('Successfully published scheduled events')

    /**
     * Tap and log and rethrow error
     */
    const tapError = (error: Error): never | Promise<void> => {
      if (error instanceof NoScheduledEventsError) {
        console.log('No events scheduled to be sent, aborting')
        return Promise.resolve()
      }

      console.error('Error occurred while attempting to get or publish scheduled events', JSON.stringify({
        name: error.name,
        stack: error.stack,
        message: error.message
      }))
      throw error
    }

    console.log('Attempting to get and publish scheduled events', JSON.stringify({ event }))
    return this.schedulerService.publishScheduledEvents(event.time)
      .then(tapResponse)
      .catch(tapError)
  }
}

export { Controller }
