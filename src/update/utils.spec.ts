import * as bumpBetaVersionType from './utils'

describe('bumpBetaVersion', () => {
  const readFileSyncSpy = jest.fn()
  const spinnerSpy = jest.fn()
  const spinnerStartSpy = jest.fn()
  const spinnerSucceesSpy = jest.fn()
  const writeFileSyncSpy = jest.fn()

  const MOCK_SPINNER_ARGS = 'Updating package.json...'
  const PACKAGE_JSON_PATH = 'package.json'

  jest.doMock('fs', () => ({
    readFileSync: readFileSyncSpy,
    writeFileSync: writeFileSyncSpy,
  }))

  const mockSpinner = (arg: string) => {
    spinnerSpy(arg)
    const result = { start: spinnerStartSpy, succeed: spinnerSucceesSpy }
    spinnerStartSpy.mockReturnValue(result)
    spinnerSucceesSpy.mockReturnValue(result)
    return result
  }

  beforeEach(() => {
    jest.doMock('ora', () => mockSpinner)
  })

  afterEach(() => {
    readFileSyncSpy.mockReset()
    writeFileSyncSpy.mockReset()
    spinnerSpy.mockReset()
    spinnerStartSpy.mockReset()
    spinnerSucceesSpy.mockReset()
  })

  const { bumpBetaVersion } = require('./utils') as typeof bumpBetaVersionType

  it('should bump version in package.json if argumet has correct version format', () => {
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        version: '1.0.1',
      }),
    )
    const EXPECT_FINAL_JSON = JSON.stringify({ version: '1.0.2' }, null, '  ')

    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER)
    const catchSpy = jest.fn()

    try {
      bumpBetaVersion(mockSpinner as any)
    } catch (e) {
      console.log(e)
      catchSpy(e)
    }

    expect(catchSpy).not.toBeCalled()
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).toBeCalledWith(
      PACKAGE_JSON_PATH,
      EXPECT_FINAL_JSON,
    )
    expect(spinnerSucceesSpy).toBeCalledTimes(1)

    // second test
    const PACKAGE_JSON_BUFFER_2 = Buffer.from(
      JSON.stringify({
        version: '0.0.19',
      }),
    )
    const EXPECT_FINAL_JSON_2 = JSON.stringify(
      { version: '0.0.20' },
      null,
      '  ',
    )

    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER_2)

    try {
      bumpBetaVersion(mockSpinner as any)
    } catch (e) {
      console.log(e)
      catchSpy(e)
    }

    expect(catchSpy).not.toBeCalled()
    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(2)
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      PACKAGE_JSON_PATH,
      EXPECT_FINAL_JSON_2,
    )
    expect(spinnerSucceesSpy).toBeCalledTimes(2)
  })

  it('should throw error if argumet has incorrect version format', () => {
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        version: '1.0.1-alpha',
      }),
    )
    const catchSpy = jest.fn()

    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER)

    try {
      bumpBetaVersion(mockSpinner as any)
    } catch (e) {
      console.log(e)
      catchSpy(e)
    }

    expect(spinnerSpy).toBeCalledWith(MOCK_SPINNER_ARGS)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(catchSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).not.toBeCalled()
    expect(spinnerSucceesSpy).not.toBeCalled()
  })
})
