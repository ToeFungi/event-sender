import { createSandbox } from 'sinon'
import { SchedulerRepository } from '../../../src/repositories/SchedulerRepository'
import { DDBMock } from '../../support/mocks/DDBMock'

import * as rawSchedulerResponse from '../../samples/repositories/scheduler-repository-raw-response.json'
import * as emptySchedulerResponse from '../../samples/repositories/scheduler-repository-empty-response.json'
import * as formattedSchedulerResponse from '../../samples/repositories/scheduler-repository-formatted-response.json'
import { NoScheduledEventsError } from '../../../src/errors/NoScheduledEventsError'

describe('SchedulerRepository', () => {
  const sandbox = createSandbox()

  const scheduledTime = '2019-12-04T14:00'

  let ddbMock: any
  let schedulerRepository: SchedulerRepository

  beforeEach(() => {
    ddbMock = DDBMock(sandbox)

    schedulerRepository = new SchedulerRepository(ddbMock)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#getScheduledEvents', () => {
    it('resolves with scheduled events', () => {
      ddbMock.scan
        .onFirstCall()
        .returns(ddbMock)

      ddbMock.promise
        .onFirstCall()
        .resolves(rawSchedulerResponse)

      return schedulerRepository.getScheduledEvents(scheduledTime)
        .should.become(formattedSchedulerResponse)
    })

    it('rejects when no events are currently scheduled', () => {
      ddbMock.scan
        .onFirstCall()
        .returns(ddbMock)

      ddbMock.promise
        .onFirstCall()
        .resolves(emptySchedulerResponse)

      return schedulerRepository.getScheduledEvents(scheduledTime)
        .should.be.rejectedWith(NoScheduledEventsError, 'No scheduled items, skipping.')
    })

    it('rejects when an error occurs in the repository', () => {
      ddbMock.scan
        .onFirstCall()
        .returns(ddbMock)

      ddbMock.promise
        .onFirstCall()
        .rejects(new Error('Something strange is afoot.'))

      return schedulerRepository.getScheduledEvents(scheduledTime)
        .should.be.rejectedWith(Error, 'Something strange is afoot.')
    })
  })
})
