import { createSandbox } from 'sinon'

import { Controller } from '../../src/Controller'
import { SchedulerService } from '../../src/services/SchedulerService'
import { NoScheduledEventsError } from '../../src/errors/NoScheduledEventsError'

describe('Controller', () => {
  const sandbox = createSandbox()

  const event = {
    time: '2019-04-12T14:00:00.000Z'
  }

  let schedulerService: any
  let controller: Controller

  beforeEach(() => {
    schedulerService = sandbox.createStubInstance(SchedulerService)

    controller = new Controller(schedulerService)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#handler', () => {
    it('resolves when events were successfully retrieved and published', () => {
      schedulerService.publishScheduledEvents
        .onFirstCall()
        .resolves()

      return controller.handler(event)
        .should.be.fulfilled
        .then(() => {
          schedulerService.publishScheduledEvents.should.have.been.calledOnceWithExactly(event.time)
        })
    })

    it('resolves when no events were scheduled for the specified time', () => {
      schedulerService.publishScheduledEvents
        .onFirstCall()
        .rejects(new NoScheduledEventsError('No events scheduled.'))

      return controller.handler(event)
        .should.be.fulfilled
        .then(() => {
          schedulerService.publishScheduledEvents.should.have.been.calledOnceWithExactly(event.time)
        })
    })

    it('rejects when an error occurs within the scheduler service', () => {
      schedulerService.publishScheduledEvents
        .onFirstCall()
        .rejects(new Error('Something strange is afoot.'))

      return controller.handler(event)
        .should.be.rejectedWith(Error, 'Something strange is afoot.')
        .then(() => {
          schedulerService.publishScheduledEvents.should.have.been.calledOnceWithExactly(event.time)
        })
    })
  })
})
