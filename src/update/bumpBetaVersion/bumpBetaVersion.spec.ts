import * as utilsType from '.'

describe('bumpBetaVersion', () => {
  const readFileSyncSpy = jest.fn()
  const spinnerSpy = jest.fn()
  const spinnerStartSpy = jest.fn()
  const spinnerSuccessSpy = jest.fn()
  const writeFileSyncSpy = jest.fn()
  const execaSpy = jest.fn()

  const MOCK_SPINNER_ARGS = 'Updating package.json...'
  const PACKAGE_JSON_PATH = 'package.json'
  const MOCK_NAME = 'name'
  const MOCK_REGISTRY = 'registry'

  jest.doMock('execa', () => ({ command: execaSpy }))
  jest.doMock('fs', () => ({
    readFileSync: readFileSyncSpy,
    writeFileSync: writeFileSyncSpy,
  }))

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
    readFileSyncSpy.mockReset()
    writeFileSyncSpy.mockReset()
    spinnerSpy.mockReset()
    spinnerStartSpy.mockReset()
    spinnerSuccessSpy.mockReset()
    execaSpy.mockReset()
  })

  const { default: bumpBetaVersion } = require('.') as typeof utilsType

  it('should bump version in package.json and execute git command if argument has correct version format', async () => {
    const MOCK_REGISTRY_VERSION = '1.0.0'
    const MOCK_VERSION = '1.0.1'
    const MOCK_VERSION_UPDATED = '1.0.2'
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        name: MOCK_NAME,
        publishConfig: { registry: MOCK_REGISTRY },
        version: MOCK_VERSION,
      }),
    )
    const EXPECT_FINAL_JSON = JSON.stringify(
      {
        name: MOCK_NAME,
        publishConfig: { registry: MOCK_REGISTRY },
        version: MOCK_VERSION_UPDATED,
      },
      null,
      '  ',
    )
    const EXPECTED_EXECA_COMMANDS = [
      [`npm view ${MOCK_NAME}@beta version --registry=${MOCK_REGISTRY}`],
      [`git add package.json`],
      [`git commit -m "chore(release-beta):\\${MOCK_VERSION_UPDATED}"`],
      [`git tag v${MOCK_VERSION_UPDATED}`],
    ]

    execaSpy.mockReturnValueOnce({ stdout: MOCK_REGISTRY_VERSION })
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
    expect(spinnerSuccessSpy).toBeCalledTimes(1)

    execaSpy.mockReset()

    // second test
    const MOCK_REGISTRY_VERSION_2 = '0.0.18'
    const MOCK_VERSION_2 = '0.0.19'
    const MOCK_VERSION_2_UPDATED = '0.0.20'
    const PACKAGE_JSON_BUFFER_2 = Buffer.from(
      JSON.stringify({
        name: MOCK_NAME,
        publishConfig: { registry: MOCK_REGISTRY },
        version: MOCK_VERSION_2,
      }),
    )
    const EXPECT_FINAL_JSON_2 = JSON.stringify(
      {
        name: MOCK_NAME,
        publishConfig: { registry: MOCK_REGISTRY },
        version: MOCK_VERSION_2_UPDATED,
      },

      null,
      '  ',
    )
    const EXPECTED_EXECA_COMMANDS_2 = [
      [`npm view ${MOCK_NAME}@beta version --registry=${MOCK_REGISTRY}`],
      [`git add package.json`],
      [`git commit -m "chore(release-beta):\\${MOCK_VERSION_2_UPDATED}"`],
      [`git tag v${MOCK_VERSION_2_UPDATED}`],
    ]

    execaSpy.mockReturnValueOnce({ stdout: MOCK_REGISTRY_VERSION_2 })
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
    expect(spinnerSuccessSpy).toBeCalledTimes(2)
  })

  it('should throw error if argument has incorrect version format', async () => {
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
    expect(spinnerSuccessSpy).not.toBeCalled()
  })

  it('should bump version in package.json and execute git command if argument has correct version format and should use version from registry if it is higher', async () => {
    const MOCK_REGISTRY_VERSION = '1.1.0'
    const MOCK_VERSION = '1.0.1'
    const MOCK_VERSION_UPDATED = '1.1.1'
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        name: MOCK_NAME,
        publishConfig: { registry: MOCK_REGISTRY },
        version: MOCK_VERSION,
      }),
    )
    const EXPECT_FINAL_JSON = JSON.stringify(
      {
        name: MOCK_NAME,
        publishConfig: { registry: MOCK_REGISTRY },
        version: MOCK_VERSION_UPDATED,
      },
      null,
      '  ',
    )
    const EXPECTED_EXECA_COMMANDS = [
      [`npm view ${MOCK_NAME}@beta version --registry=${MOCK_REGISTRY}`],
      [`git add package.json`],
      [`git commit -m "chore(release-beta):\\${MOCK_VERSION_UPDATED}"`],
      [`git tag v${MOCK_VERSION_UPDATED}`],
    ]

    execaSpy.mockReturnValueOnce({ stdout: MOCK_REGISTRY_VERSION })
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
    expect(spinnerSuccessSpy).toBeCalledTimes(1)
  })

  it('should call git tag command correctly when tagPrefix option is valid', async () => {
    const MOCK_VERSION = '1.0.1'
    const MOCK_REGISTRY_VERSION = '1.0.1'
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        name: MOCK_NAME,
        publishConfig: { registry: MOCK_REGISTRY },
        version: MOCK_VERSION,
      }),
    )

    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER)

    execaSpy.mockReturnValueOnce({ stdout: MOCK_REGISTRY_VERSION })

    await bumpBetaVersion(mockSpinner as any, 'eslint')

    const EXPECTED_EXECA_COMMANDS = [
      [`npm view ${MOCK_NAME}@beta version --registry=${MOCK_REGISTRY}`],
      [`git add package.json`],
      [`git commit -m "chore(release-beta):\\eslint@1.0.2"`],
      [`git tag eslint@1.0.2`],
    ]

    expect(execaSpy.mock.calls).toEqual(EXPECTED_EXECA_COMMANDS)
  })

  it('should bump version in package.json as beta correctly when release beta in first time', async () => {
    const MOCK_VERSION = '1.1.0'
    const MOCK_REGISTRY_VERSION = undefined
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        name: MOCK_NAME,
        publishConfig: { registry: MOCK_REGISTRY },
        version: MOCK_VERSION,
      }),
    )

    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER)

    execaSpy.mockReturnValueOnce({ stdout: MOCK_REGISTRY_VERSION })

    await bumpBetaVersion(mockSpinner as any)

    const EXPECTED_EXECA_COMMANDS = [
      [`npm view ${MOCK_NAME}@beta version --registry=${MOCK_REGISTRY}`],
      [`git add package.json`],
      [`git commit -m "chore(release-beta):\\1.1.1"`],
      [`git tag v1.1.1`],
    ]

    expect(execaSpy.mock.calls).toEqual(EXPECTED_EXECA_COMMANDS)
  })
})
