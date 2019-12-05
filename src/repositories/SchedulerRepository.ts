import { AWSError } from 'aws-sdk'
import { DocumentClient, ScanInput, ScanOutput } from 'aws-sdk/clients/dynamodb'

import { ScheduledEvent } from '../types/ScheduledEvent'
import { NoScheduledEventsError } from '../errors/NoScheduledEventsError'

/**
 * SchedulerRepository access DynamoDB to manipulate stored scheduled events
 */
class SchedulerRepository {
  constructor(protected ddb: DocumentClient) {
  }

  /**
   * Get the scheduled events for the time provided from DynamoDB
   */
  public getScheduledEvents(scheduledTime: any): Promise<ScheduledEvent[]> {
    const params: ScanInput = {
      TableName: 'scheduled-events',
      FilterExpression: '#name = :value',
      ExpressionAttributeNames: {
        '#name': 'scheduledTime'
      },
      ExpressionAttributeValues: {
        ':value': scheduledTime
      }
    }

    /**
     * Get the items from the response and log, map and return the formatted scheduled events
     */
    const retrieveItem = (items: ScanOutput): ScheduledEvent[] => {
      console.debug('Response items from DynamoDB', JSON.stringify({ items }))

      if (!items.Items || !items.Items.length) {
        throw new NoScheduledEventsError('No scheduled items, skipping.')
      }

      return items.Items.map((item: any): ScheduledEvent => JSON.parse(item.payload).payload as ScheduledEvent)
    }

    /**
     * Tap and log and rethrow the error
     */
    const tapError = (error: AWSError): never => {
      console.error('Error occurred in the SchedulerRepository', JSON.stringify({ message: error.message }))
      throw error
    }

    console.debug('Attempting to query DynamoDB for scheduled events', JSON.stringify({ params }))
    return this.ddb.scan(params)
      .promise()
      .then(retrieveItem)
      .catch(tapError)
  }
}

export { SchedulerRepository }
