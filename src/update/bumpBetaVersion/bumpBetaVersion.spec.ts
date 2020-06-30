import * as utilsType from '.'

describe('bumpBetaVersion', () => {
  const readFileSyncSpy = jest.fn()
  const spinnerSpy = jest.fn()
  const spinnerStartSpy = jest.fn()
  const spinnerSucceesSpy = jest.fn()
  const writeFileSyncSpy = jest.fn()
  const execaSpy = jest.fn()

  const MOCK_SPINNER_ARGS = 'Updating package.json...'
  const PACKAGE_JSON_PATH = 'package.json'

  jest.doMock('execa', () => execaSpy)
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
    execaSpy.mockReset()
  })

  const { default: bumpBetaVersion } = require('.') as typeof utilsType

  it('should bump version in package.json and execute git command if argumet has correct version format', async () => {
    const MOCK_VERSION = '1.0.1'
    const MOCK_VERSION_UPDATED = '1.0.2'
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        version: MOCK_VERSION,
      }),
    )
    const EXPECT_FINAL_JSON = JSON.stringify(
      { version: MOCK_VERSION_UPDATED },
      null,
      '  ',
    )
    const EXPECTED_EXECA_COMMANDS = [
      [`git add package.json`],
      [`git commit -m "chore(release-beta): ${MOCK_VERSION_UPDATED}"`],
      [`git tag v${MOCK_VERSION_UPDATED}"`],
    ]

    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER)
    const catchSpy = jest.fn()

    try {
      await bumpBetaVersion(mockSpinner as any)
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
    expect(execaSpy.mock.calls).toEqual(EXPECTED_EXECA_COMMANDS)
    expect(spinnerSucceesSpy).toBeCalledTimes(1)

    execaSpy.mockReset()

    // second test
    const MOCK_VERSION_2 = '0.0.19'
    const MOCK_VERSION_2_UPDATED = '0.0.20'
    const PACKAGE_JSON_BUFFER_2 = Buffer.from(
      JSON.stringify({
        version: MOCK_VERSION_2,
      }),
    )
    const EXPECT_FINAL_JSON_2 = JSON.stringify(
      { version: MOCK_VERSION_2_UPDATED },
      null,
      '  ',
    )
    const EXPECTED_EXECA_COMMANDS_2 = [
      [`git add package.json`],
      [`git commit -m "chore(release-beta): ${MOCK_VERSION_2_UPDATED}"`],
      [`git tag v${MOCK_VERSION_2_UPDATED}"`],
    ]

    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER_2)

    try {
      await bumpBetaVersion(mockSpinner as any)
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
    expect(execaSpy.mock.calls).toEqual(EXPECTED_EXECA_COMMANDS_2)
    expect(spinnerSucceesSpy).toBeCalledTimes(2)
  })

  it('should throw error if argumet has incorrect version format', async () => {
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        version: '1.0.1-alpha',
      }),
    )
    const catchSpy = jest.fn()

    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER)

    try {
      await bumpBetaVersion(mockSpinner as any)
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
