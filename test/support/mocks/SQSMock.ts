import { SinonSandbox } from 'sinon'

const SQSMock = (sandbox: SinonSandbox) => ({
  promise: sandbox.stub(),
  sendMessage: sandbox.stub()
})

export { SQSMock }
