import { handler } from '../../src'

const event = {
  time: '2019-12-01T15:43:39.840Z'
}

handler(event)
  .then(() => console.log('finished'))
  .catch(console.error)
