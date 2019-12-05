import { handler } from '../../src'

// Schedule an event for in the future and run the integration test on the minute the event is scheduled for

handler()
  .then(() => console.log('finished'))
  .catch(console.error)
