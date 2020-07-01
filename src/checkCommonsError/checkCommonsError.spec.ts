import { PublishLevel } from 'types'

import * as checkCommonsErrorType from './'

describe('checkCommonsError', () => {
  const NEW_PUBLISH_COMMAND = 'new_COMMAND'
  const checkGitErrorSpy = jest.fn()
  const checkPublishMethodSpy = jest.fn()
  const processExitSpy = jest
    .spyOn(process, 'exit')
    .mockImplementation((() => ({})) as any)

  jest.doMock('./checkGitError', () => checkGitErrorSpy)
  jest.doMock('./checkPublishMethod', () => checkPublishMethodSpy)

  beforeEach(() => {
    checkPublishMethodSpy.mockReturnValue(NEW_PUBLISH_COMMAND)
  })

  afterEach(() => {
    checkGitErrorSpy.mockReset()
    checkPublishMethodSpy.mockReset()
  })

  it('should call function with expected result', async () => {
    const {
      default: checkCommonsError,
    } = require('.') as typeof checkCommonsErrorType
    const result = await checkCommonsError(PublishLevel.BETA)
    expect(checkGitErrorSpy).toBeCalledWith(PublishLevel.BETA)
    expect(checkGitErrorSpy).toBeCalledTimes(1)
    expect(checkPublishMethodSpy).toBeCalledWith()
    expect(checkPublishMethodSpy).toBeCalledTimes(1)
    expect(result).toBe(NEW_PUBLISH_COMMAND)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should exit when any of utils function throw error', async () => {
    const {
      default: checkCommonsError,
    } = require('.') as typeof checkCommonsErrorType
    checkPublishMethodSpy.mockReset()
    checkPublishMethodSpy.mockImplementationOnce(() => {
      throw new Error('BOOM')
    })
    const result = await checkCommonsError(PublishLevel.BETA)
    expect(checkGitErrorSpy).toBeCalledWith(PublishLevel.BETA)
    expect(checkGitErrorSpy).toBeCalledTimes(1)
    expect(checkPublishMethodSpy).toBeCalledWith()
    expect(checkPublishMethodSpy).toBeCalledTimes(1)
    expect(processExitSpy).toBeCalledWith(1)
  })

  it('should exit process when using wrong publish level', async () => {
    const {
      default: checkCommonsError,
    } = require('.') as typeof checkCommonsErrorType
    await checkCommonsError('sd' as PublishLevel)
    expect(checkGitErrorSpy).not.toBeCalled()
    expect(checkPublishMethodSpy).not.toBeCalled()
    expect(processExitSpy).toBeCalledWith(1)
  })
})
