import { PublishLevel } from 'types'
import * as updatePackageJsonType from '.'

describe('startCommand', () => {
  const standardVersionSpy = jest.fn()
  const bumpBetaVersionSpy = jest.fn()
  const spinnerSpy = jest.fn()
  const spinnerStartSpy = jest.fn()
  const spinnerSuccessSpy = jest.fn()

  const processExitSpy = jest
    .spyOn(process, 'exit')
    .mockImplementation((() => ({})) as any)

  const MOCK_SPINNER_ARGS = 'Tagging Package Version...'

  jest.doMock('standard-version', () => standardVersionSpy)
  jest.doMock('./bumpBetaVersion', () => bumpBetaVersionSpy)

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
    standardVersionSpy.mockReset()
    bumpBetaVersionSpy.mockReset()
    spinnerSpy.mockReset()
    spinnerStartSpy.mockReset()
    spinnerSuccessSpy.mockReset()
  })

  it('should use correct publish method when publish as beta', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    await updatePackageJson(PublishLevel.BETA)
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(bumpBetaVersionSpy).toBeCalledWith(mockSpinner, undefined)
    expect(spinnerSuccessSpy).toBeCalledTimes(1)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should use correct publish method with tagPrefix when publish as beta', async () => {
    const {
      default: updatePackageJson,
    } = require('.') as typeof updatePackageJsonType
    await updatePackageJson(PublishLevel.BETA, 'eslint')
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(bumpBetaVersionSpy).toBeCalledWith(mockSpinner, 'eslint')
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
    bumpBetaVersionSpy.mockImplementationOnce(() => {
      throw new Error('BOOM')
    })
    await updatePackageJson(PublishLevel.BETA)
    expect(spinnerSpy).toBeCalledTimes(1)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(spinnerSuccessSpy).not.toBeCalled()
    expect(processExitSpy).toBeCalledWith(1)
  })
})
