import * as AWS from 'aws-sdk'
import { SchedulerRepository } from './repositories/SchedulerRepository'

const ddb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1'
})
const schedulerRepository = new SchedulerRepository(ddb)

schedulerRepository.getScheduledEvents('2019-10-04T15:43')
  .then(console.log)
  .catch(console.error)