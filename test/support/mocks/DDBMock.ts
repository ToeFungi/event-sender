import { SinonSandbox } from 'sinon'

const DDBMock = (sandbox: SinonSandbox) => ({
  scan: sandbox.stub(),
  promise: sandbox.stub()
})

export { DDBMock }
