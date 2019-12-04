import { Notifier } from '../types/Notifier'
import { HTTPCallback } from '../clients/HTTPCallback'
import { CallbackConfig } from '../types/CallbackConfig'

/**
 * NotifierFactory determines the notifier to be used based on the message callback mechanism specified in the scheduled
 * event
 */
class NotifierFactory {
  /**
   * Gets an instance of a notifier to be used to notify the client of the scheduled event
   */
  public static getNotifier(callbackConfig: CallbackConfig): Notifier {
    return new HTTPCallback(callbackConfig)
  }
}

export { NotifierFactory }
