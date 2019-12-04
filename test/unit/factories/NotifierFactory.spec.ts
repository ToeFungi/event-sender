import { HTTPCallback } from '../../../src/clients/HTTPCallback'
import { CallbackConfig } from '../../../src/types/CallbackConfig'
import { NotifierFactory } from '../../../src/factories/NotifierFactory'
import { NotificationMethods } from '../../../src/enums/NotificationMethods'

describe('NotifierFactory', () => {
  const createCase = (instance: any, name: string, type: string) => ({ instance, name, type })
  const tests = [
    createCase(HTTPCallback, 'HTTPCallback', NotificationMethods.HTTP)
  ]

  describe('#getNotifier', () => {
    tests.forEach(test => {
      it(`returns an instance of ${test.name}`, () => {
        return NotifierFactory.getNotifier({ type: test.type } as CallbackConfig)
          .should.be.instanceof(test.instance)
      })
    })
  })
})
