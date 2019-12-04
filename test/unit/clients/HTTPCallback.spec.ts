import * as nock from 'nock'

import { HTTPCallback } from '../../../src/clients/HTTPCallback'
import { CallbackConfig } from '../../../src/types/CallbackConfig'
import { ScheduledMessage } from '../../../src/types/ScheduledMessage'

describe('HTTPCallback', () => {
  const config = {
    url: 'http://test-url.com',
    type: 'HTTP'
  } as CallbackConfig

  const message = {
    some: 'body'
  } as ScheduledMessage

  let httpCallback: HTTPCallback

  beforeEach(() => {
    httpCallback = new HTTPCallback(config)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('#notify', () => {
    it('resolves after sending the notification to the client', () => {
      nock(config.url)
        .post('/', message)
        .reply(200)

      return httpCallback.notify(message)
        .should.be.fulfilled
    })

    it('rejects when an error occurs while notifying the client', () => {
      nock(config.url)
        .post('/', message)
        .replyWithError('Something strange is afoot.')

      return httpCallback.notify(message)
        .should.be.rejectedWith(Error, 'Something strange is afoot.')
    })
  })
})
