import { PublishLevel } from 'types'
import * as startCommandType from '.'

describe('startCommand', () => {
  const MOCK_RETURN_PUBLISH_LEVEL = '_publishLevel'

  const publishSpy = jest.fn()
  const updatePackageJsonSpy = jest.fn()
  const checkCommonsErrorSpy = jest.fn()

  jest.doMock('publish', () => publishSpy)
  jest.doMock('update', () => updatePackageJsonSpy)
  jest.doMock('checkCommonsError', () => checkCommonsErrorSpy)

  const { startCommand } = require('.') as typeof startCommandType

  beforeEach(() => {
    checkCommonsErrorSpy.mockReturnValue(MOCK_RETURN_PUBLISH_LEVEL)
  })

  afterEach(() => {
    checkCommonsErrorSpy.mockReset()
  })

  it('should be able to start command correctly', async () => {
    const MOCK_PUBLISH_LEVEL = 'beta'
    await startCommand(MOCK_PUBLISH_LEVEL)

    expect(checkCommonsErrorSpy).toBeCalledWith(PublishLevel.BETA)
    expect(updatePackageJsonSpy).toBeCalledWith(PublishLevel.BETA, undefined)
    expect(publishSpy).toBeCalledWith(
      MOCK_RETURN_PUBLISH_LEVEL,
      PublishLevel.BETA,
    )

    const MOCK_PUBLISH_LEVEL_2 = 'minor'
    await startCommand(MOCK_PUBLISH_LEVEL_2)
    expect(checkCommonsErrorSpy).toBeCalledWith(PublishLevel.MINOR)
    expect(updatePackageJsonSpy).toBeCalledWith(PublishLevel.MINOR, undefined)
    expect(publishSpy).toBeCalledWith(
      MOCK_RETURN_PUBLISH_LEVEL,
      PublishLevel.MINOR,
    )

    const MOCK_PUBLISH_LEVEL_3 = 'major'
    await startCommand(MOCK_PUBLISH_LEVEL_3)

    expect(checkCommonsErrorSpy).toBeCalledWith(PublishLevel.MAJOR)
    expect(updatePackageJsonSpy).toBeCalledWith(PublishLevel.MAJOR, undefined)
    expect(publishSpy).toBeCalledWith(
      MOCK_RETURN_PUBLISH_LEVEL,
      PublishLevel.MAJOR,
    )
  })

  it('should start command with tagPrefix option correctly', async () => {
    const MOCK_PUBLISH_LEVEL = 'minor'

    await startCommand(MOCK_PUBLISH_LEVEL, { tagPrefix: 'eslint' })

    expect(updatePackageJsonSpy).toBeCalledWith(PublishLevel.MINOR, 'eslint')
  })
})
