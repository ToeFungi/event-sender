import { AWSError, SQS } from 'aws-sdk'
import { SendMessageRequest } from 'aws-sdk/clients/sqs'

import { Notifier } from '../types/Notifier'
import { CallbackConfig } from '../types/CallbackConfig'
import { ScheduledMessage } from '../types/ScheduledMessage'

/**
 * SQSProducer sends a notification to the client via SQS
 */
class SQSProducer implements Notifier {
  constructor(private config: CallbackConfig, protected sqs: SQS) {
  }

  /**
   * Publish scheduled event to client on required SQS queue
   */
  notify(message: ScheduledMessage): Promise<void> {
    const event: SendMessageRequest = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.config.url
    }

    /**
     * Tap and log response from SQS
     */
    const tapResponse = (): void => console.log('Successfully published scheduled event to SQS')

    /**
     * Tap and log and rethrow the error
     */
    const tapError = (error: AWSError): never => {
      console.error('Error occurred while attempting to publish event to SQS', JSON.stringify({
        message: error.message
      }))
      throw error
    }

    console.debug('Attempt to publish scheduled event to SQS', JSON.stringify({ event }))
    return this.sqs.sendMessage(event)
      .promise()
      .then(tapResponse)
      .catch(tapError)
  }
}

export { SQSProducer }
