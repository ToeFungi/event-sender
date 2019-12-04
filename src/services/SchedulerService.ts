import { SchedulerRepository } from '../repositories/SchedulerRepository'

class SchedulerService {
  constructor(protected schedulerRepository: SchedulerRepository) {
  }

  public getEvents(time: string) {
    this.schedulerRepository.getScheduledEvents(time)
  }
}

export { SchedulerService }
