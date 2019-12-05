import { createSandbox } from 'sinon'

import { SQSMock } from '../../support/mocks/SQSMock'
import { SendMessageRequest } from 'aws-sdk/clients/sqs'
import { SQSProducer } from '../../../src/producers/SQSProducer'
import { CallbackConfig } from '../../../src/types/CallbackConfig'
import { ScheduledMessage } from '../../../src/types/ScheduledMessage'

describe('SQSProducer', () => {
  const sandbox = createSandbox()

  const config = {
    url: 'some-sqs-queue-url'
  } as CallbackConfig

  const message = {
    clientId: 'some-client-id'
  } as ScheduledMessage

  const sqsMessage = {
    QueueUrl: config.url,
    MessageBody: JSON.stringify(message)
  } as SendMessageRequest

  let sqs: any
  let sqsProducer: SQSProducer

  beforeEach(() => {
    sqs = SQSMock(sandbox)

    sqsProducer = new SQSProducer(config, sqs)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#notify', () => {
    it('resolves when a message is successfully published to an SQS queue', () => {
      sqs.sendMessage
        .onFirstCall()
        .returns(sqs)

      sqs.promise
        .onFirstCall()
        .resolves()

      return sqsProducer.notify(message)
        .should.be.fulfilled
        .then(() => {
          sqs.sendMessage.should.have.been.calledOnceWithExactly(sqsMessage)
        })
    })

    it('rejects when an error occurs when attempting to publish to an SQS queue', () => {
      sqs.sendMessage
        .onFirstCall()
        .returns(sqs)

      sqs.promise
        .onFirstCall()
        .rejects(new Error('Something strange is afoot.'))

      return sqsProducer.notify(message)
        .should.be.rejectedWith(Error, 'Something strange is afoot.')
        .then(() => {
          sqs.sendMessage.should.have.been.calledWithExactly(sqsMessage)
        })
    })
  })
})
