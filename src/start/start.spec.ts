import { IOptions, PublishLevel } from 'types'
import * as startCommandType from '.'
import { DEFAULT_PUBLISH_COMMAND } from '../pongConstants'

describe('startCommand', () => {
  const publishSpy = jest.fn()
  const updatePackageJsonSpy = jest.fn()

  jest.doMock('publish', () => publishSpy)
  jest.doMock('update', () => ({ updatePackageJson: updatePackageJsonSpy }))

  const { startCommand } = require('.') as typeof startCommandType

  it('should be able to start command correctly', async () => {
    const MOCK_OPTIONS: IOptions = {
      publishMethod: DEFAULT_PUBLISH_COMMAND,
    }
    const MOCK_PUBLISH_LEVEL = 'beta'
    await startCommand(MOCK_PUBLISH_LEVEL, MOCK_OPTIONS)
    expect(updatePackageJsonSpy).toBeCalledWith(PublishLevel.BETA)
    expect(publishSpy).toBeCalledWith(
      MOCK_OPTIONS.publishMethod,
      PublishLevel.BETA,
    )

    const MOCK_PUBLISH_LEVEL_2 = 'minor'
    await startCommand(MOCK_PUBLISH_LEVEL_2, MOCK_OPTIONS)
    expect(updatePackageJsonSpy).toBeCalledWith(PublishLevel.MINOR)
    expect(publishSpy).toBeCalledWith(
      MOCK_OPTIONS.publishMethod,
      PublishLevel.MINOR,
    )

    const MOCK_PUBLISH_LEVEL_3 = 'major'
    await startCommand(MOCK_PUBLISH_LEVEL_3, MOCK_OPTIONS)
    expect(updatePackageJsonSpy).toBeCalledWith(PublishLevel.MAJOR)
    expect(publishSpy).toBeCalledWith(
      MOCK_OPTIONS.publishMethod,
      PublishLevel.MAJOR,
    )
  })
})
