import { AWSError } from 'aws-sdk'
import Axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

import { CallbackConfig } from '../types/CallbackConfig'
import { ScheduledMessage } from '../types/ScheduledMessage'
import { Notifier } from '../types/Notifier'

/**
 * HTTPCallback sends a notification to the client via HTTP
 */
class HTTPCallback implements Notifier {
  /**
   * The HTTP client used to send the notification
   */
  private axios: AxiosInstance

  constructor(protected configuration: CallbackConfig) {
    const config: AxiosRequestConfig = {
      baseURL: this.configuration.url,
      headers: this.configuration.headers,
      timeout: 5000
    }

    this.axios = Axios.create(config)
  }

  /**
   * Sends a notification to the relevant http endpoint with the payload scheduled
   */
  public notify(message: ScheduledMessage): Promise<void> {
    /**
     * Tap response and log it
     */
    const tapResponse = (): void => console.debug('Successfully notified client.')

    /**
     * Tap and log and rethrow the error
     */
    const tapError = (error: AWSError): never => {
      console.error('Error occurred in HTTPCallback', JSON.stringify({ message: error.message }))
      throw error
    }

    console.debug('Attempt to post scheduled message to client', JSON.stringify({ message }))
    return this.axios.post('/', message)
      .then(tapResponse)
      .catch(tapError)
  }
}

export { HTTPCallback }
