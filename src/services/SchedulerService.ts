import 'moment-timezone'

import * as moment from 'moment'

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
  public publishScheduledEvents(): Promise<void> {
    const formattedTime = moment()
      .tz('UTC')
      .format('YYYY-MM-DDTHH:mm')

    /**
     * Loop through each event and notify the client
     */
    const notifyClients = async (events: ScheduledEvent[]) => {
      for (const event of events) {
        await NotifierFactory.getNotifier(event.callback)
          .notify(event.message)
      }
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

    console.debug('Attempting to get scheduled events and notify clients', JSON.stringify({ formattedTime }))
    return this.schedulerRepository.getScheduledEvents(formattedTime)
      .then(notifyClients)
      .then(tapResponse)
      .catch(tapError)
  }
}

export { SchedulerService }
