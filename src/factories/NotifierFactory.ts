import { SQS } from 'aws-sdk'

import { Notifier } from '../types/Notifier'
import { SQSProducer } from '../producers/SQSProducer'
import { HTTPCallback } from '../clients/HTTPCallback'
import { CallbackConfig } from '../types/CallbackConfig'
import { NotificationMethods } from '../enums/NotificationMethods'

/**
 * NotifierFactory determines the notifier to be used based on the message callback mechanism specified in the scheduled
 * event
 */
class NotifierFactory {
  /**
   * Gets an instance of a notifier to be used to notify the client of the scheduled event
   */
  public static getNotifier(callbackConfig: CallbackConfig): Notifier {
    switch (callbackConfig.type) {
      case NotificationMethods.HTTP:
        return new HTTPCallback(callbackConfig)
      case NotificationMethods.SQS:
        const sqs = new SQS(callbackConfig.headers)
        return new SQSProducer(callbackConfig, sqs)
      default:
        return new HTTPCallback(callbackConfig)
    }
  }
}

export { NotifierFactory }
