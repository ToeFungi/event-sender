import { SchedulerService } from './services/SchedulerService'

class Controller {
  constructor(protected schedulerService: SchedulerService) {
  }

  public handler(event: any) {
    return this.schedulerService.publishScheduledEvents(event.time)
  }
}

export { Controller }
