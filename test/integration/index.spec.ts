import { handler } from '../../src'

const event = {
  time: '2019-12-05T16:27:32.846Z'
}

handler(event)
  .then(() => console.log('finished'))
  .catch(console.error)
