import { SchedulerRepository } from '../repositories/SchedulerRepository'

class SchedulerService {
  constructor(protected schedulerRepository: SchedulerRepository) {
  }

  public publishScheduledEvents(time: string) {
    return this.schedulerRepository.getScheduledEvents(time)
      .then()
  }
}

export { SchedulerService }
