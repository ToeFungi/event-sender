import { SchedulerService } from './services/SchedulerService'

class Controller {
  constructor(protected schedulerService: SchedulerService) {
  }

  public handler(event: any) {
    const tapResponse = () => console.log('Successfully ')

    return this.schedulerService.getEvents(event.time)
  }
}

export { Controller }
