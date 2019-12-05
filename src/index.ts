import * as AWS from 'aws-sdk'

import { Version } from './lib/Version'
import { Controller } from './Controller'
import { SchedulerService } from './services/SchedulerService'
import { SchedulerRepository } from './repositories/SchedulerRepository'

// Repositories
const ddb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1'
})
const schedulerRepository = new SchedulerRepository(ddb)

// Services
const schedulerService = new SchedulerService(schedulerRepository)

// Controller
const controller = new Controller(schedulerService)

console.log('EventSender', Version.getGitHash())
export const handler = controller.handler.bind(controller)
