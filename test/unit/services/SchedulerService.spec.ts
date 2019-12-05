import { reset, set } from 'mockdate'

import { createSandbox } from 'sinon'

import { HTTPCallback } from '../../../src/clients/HTTPCallback'
import { NotifierFactory } from '../../../src/factories/NotifierFactory'
import { SchedulerService } from '../../../src/services/SchedulerService'
import { SchedulerRepository } from '../../../src/repositories/SchedulerRepository'

import * as multipleHTTPEvents from '../../samples/services/scheduler-service-multiple-http-event.json'

describe('SchedulerService', () => {
  const sandbox = createSandbox()

  const time = '2019-11-27T15:47:32.846Z'
  const formattedTime = '2019-11-27T15:47'

  let httpCallback: any
  let notifierFactory: any
  let schedulerRepository: any
  let schedulerService: SchedulerService

  beforeEach(() => {
    set(time)
    notifierFactory = sandbox.stub(NotifierFactory, 'getNotifier')

    httpCallback = sandbox.createStubInstance(HTTPCallback)
    schedulerRepository = sandbox.createStubInstance(SchedulerRepository)

    schedulerService = new SchedulerService(schedulerRepository)
  })

  afterEach(() => {
    reset()
    sandbox.restore()
  })

  describe('#publishScheduledEvents', () => {
    it('resolves after notifying multiple clients via HTTP callback mechanism', () => {
      const firstEvent = multipleHTTPEvents[0]
      const secondEvent = multipleHTTPEvents[1]

      schedulerRepository.getScheduledEvents
        .onFirstCall()
        .resolves(multipleHTTPEvents)

      notifierFactory.onFirstCall()
        .returns(httpCallback)
        .onSecondCall()
        .returns(httpCallback)

      httpCallback.notify
        .onFirstCall()
        .resolves()
        .onSecondCall()
        .resolves()

      return schedulerService.publishScheduledEvents()
        .should.be.fulfilled
        .then(() => {
          schedulerRepository.getScheduledEvents.should.have.been.calledOnceWithExactly(formattedTime)
          notifierFactory.should.have.callCount(2).and.calledWith(firstEvent.callback)
            .and.calledWith(secondEvent.callback)
          httpCallback.notify.should.have.callCount(2).and.calledWith(firstEvent.message)
            .and.calledWith(secondEvent.message)
        })
    })

    it('resolves after notifying a single client via HTTP callback mechanism', () => {
      const singleEvent = multipleHTTPEvents[0]

      schedulerRepository.getScheduledEvents
        .onFirstCall()
        .resolves([ singleEvent ])

      notifierFactory.onFirstCall()
        .returns(httpCallback)

      httpCallback.notify
        .onFirstCall()
        .resolves()

      return schedulerService.publishScheduledEvents()
        .should.be.fulfilled
        .then(() => {
          notifierFactory.should.have.been.calledOnceWithExactly(singleEvent.callback)
          httpCallback.notify.should.have.been.calledOnceWithExactly(singleEvent.message)
          schedulerRepository.getScheduledEvents.should.have.been.calledOnceWithExactly(formattedTime)
        })
    })

    it('rejects when an error occurs in the repository', () => {
      schedulerRepository.getScheduledEvents
        .onFirstCall()
        .rejects(new Error('Something strange is afoot.'))

      return schedulerService.publishScheduledEvents()
        .should.be.rejectedWith(Error, 'Something strange is afoot.')
    })
  })
})
