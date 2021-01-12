import { PublishLevel } from 'types'
import * as updatePackageJsonType from '.'

describe('startCommand', () => {
  const standardVersionSpy = jest.fn()
  const spinnerSpy = jest.fn()
  const spinnerStartSpy = jest.fn()
  const spinnerSuccessSpy = jest.fn()

  const processExitSpy = jest
    .spyOn(process, 'exit')
    .mockImplementation((() => ({})) as any)

  const MOCK_SPINNER_ARGS = 'Tagging Package Version...'

  jest.doMock('standard-version', () => standardVersionSpy)

  const mockSpinner = (arg: string) => {
    spinnerSpy(arg)
    const result = { start: spinnerStartSpy, succeed: spinnerSuccessSpy }
    spinnerStartSpy.mockReturnValue(result)
    spinnerSuccessSpy.mockReturnValue(result)
    return result
  }

  beforeEach(() => {
    jest.doMock('ora', () => mockSpinner)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should use correct publish method with tagPrefix when publish as beta', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    await updatePackageJson(PublishLevel.BETA)
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(2)
    const STANDARD_VERSION_ARGS = {
      prerelease: 'beta',
      skip: {
        changelog: true,
      },
      silent: true,
    }
    expect(standardVersionSpy).toBeCalledWith(STANDARD_VERSION_ARGS)
    expect(spinnerSuccessSpy).toBeCalledTimes(2)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should use correct publish method when publish as patch', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    await updatePackageJson(PublishLevel.PATCH)
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    const STANDARD_VERSION_ARGS = {
      releaseAs: 'patch',
      silent: true,
    }
    expect(standardVersionSpy).toBeCalledWith(STANDARD_VERSION_ARGS)
    expect(spinnerSuccessSpy).toBeCalledTimes(1)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should use correct publish method when publish as minor', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    await updatePackageJson(PublishLevel.MINOR)
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    const STANDARD_VERSION_ARGS = {
      releaseAs: 'minor',
      silent: true,
    }
    expect(standardVersionSpy).toBeCalledWith(STANDARD_VERSION_ARGS)
    expect(spinnerSuccessSpy).toBeCalledTimes(1)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should use correct publish method with tagPrefix when publish as minor', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    await updatePackageJson(PublishLevel.MINOR, 'eslint')
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    const STANDARD_VERSION_ARGS = {
      releaseAs: 'minor',
      silent: true,
      tagPrefix: 'eslint@',
    }
    expect(standardVersionSpy).toBeCalledWith(STANDARD_VERSION_ARGS)
    expect(spinnerSuccessSpy).toBeCalledTimes(1)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should use correct publish method when publish as major', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    await updatePackageJson(PublishLevel.MAJOR)
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    const STANDARD_VERSION_ARGS = {
      releaseAs: 'major',
      silent: true,
    }
    expect(standardVersionSpy).toBeCalledWith(STANDARD_VERSION_ARGS)
    expect(spinnerSuccessSpy).toBeCalledTimes(1)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should use correct publish method with tagPrefix when publish as major', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    await updatePackageJson(PublishLevel.MAJOR, 'eslint')
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    const STANDARD_VERSION_ARGS = {
      releaseAs: 'major',
      silent: true,
      tagPrefix: 'eslint@',
    }
    expect(standardVersionSpy).toBeCalledWith(STANDARD_VERSION_ARGS)
    expect(spinnerSuccessSpy).toBeCalledTimes(1)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should exit process when error happens', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    standardVersionSpy.mockImplementationOnce(() => {
      throw new Error('BOOM')
    })
    await updatePackageJson(PublishLevel.MAJOR)
    expect(spinnerSpy).toBeCalledTimes(1)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(spinnerSuccessSpy).not.toBeCalled()
    expect(processExitSpy).toBeCalledWith(1)
  })
})
