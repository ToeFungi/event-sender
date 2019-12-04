import { AWSError } from 'aws-sdk'

import { ScheduledEvent } from '../types/ScheduledEvent'
import { NotifierFactory } from '../factories/NotifierFactory'
import { SchedulerRepository } from '../repositories/SchedulerRepository'

/**
 * SchedulerService retrieves the scheduled messages and attempts to notify the client via the available callback
 * mechanisms available
 */
class SchedulerService {
  constructor(protected schedulerRepository: SchedulerRepository) {
  }

  /**
   * Publish scheduled events via the callback mechanisms specified in the messages
   */
  public publishScheduledEvents(time: string): Promise<void> {
    /**
     * Loop through each event and notify the client
     */
    const notifyClients = (events: ScheduledEvent[]): void => {
      // Await responses to ensure all responses are correctly published
      events.forEach(async (event: ScheduledEvent): Promise<void> => {
        return NotifierFactory.getNotifier(event.callback)
          .notify(event.message)
      })
    }

    /**
     * Tap and log response
     */
    const tapResponse = (): void => console.debug('Successfully notified clients')

    /**
     * Tap and log and rethrow the error
     */
    const tapError = (error: AWSError): never => {
      console.error('Error occurred in SchedulerService', JSON.stringify({ message: error.message }))
      throw error
    }

    console.debug('Attempting to get scheduled events and notify clients', JSON.stringify({ time }))
    return this.schedulerRepository.getScheduledEvents(time)
      .then(notifyClients)
      .then(tapResponse)
      .catch(tapError)
  }
}

export { SchedulerService }
