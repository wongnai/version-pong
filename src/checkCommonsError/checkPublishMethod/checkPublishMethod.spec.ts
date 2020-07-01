import * as checkPublishMethodType from '.'

describe('checkPublishMethod', () => {
  const MOCK_CHALK_RETURN = 'WONGNAI'
  const PACKAGE_JSON = 'package.json'

  const readFileSyncSpy = jest.fn()
  const writeFileSyncSpy = jest.fn()
  const chalkSpy = jest.fn()
  const promptSpy = jest.fn()

  jest.doMock('fs', () => ({
    readFileSync: readFileSyncSpy,
    writeFileSync: writeFileSyncSpy,
  }))
  jest.doMock('chalk', () => ({ blue: { bold: chalkSpy } }))
  jest.doMock('inquirer', () => ({ prompt: promptSpy }))

  beforeEach(() => {
    chalkSpy.mockReturnValue(MOCK_CHALK_RETURN)
  })

  afterEach(() => {
    chalkSpy.mockReset()
    readFileSyncSpy.mockReset()
    writeFileSyncSpy.mockReset()
  })

  const {
    default: checkPublishMethod,
  } = require('.') as typeof checkPublishMethodType

  it('should use publishCommand in package.json if publishCommand not specified on cli', async () => {
    const MOCK_PUBLISH_COMMAND = 'publish_commands'
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        test: 'test',
        ['version-pong']: {
          method: MOCK_PUBLISH_COMMAND,
          someOptions: '1234',
        },
      }),
    )
    readFileSyncSpy.mockReturnValueOnce(PACKAGE_JSON_BUFFER)
    const result = await checkPublishMethod()

    expect(readFileSyncSpy).toBeCalledWith(PACKAGE_JSON)
    expect(writeFileSyncSpy).not.toBeCalled()
    expect(chalkSpy).not.toBeCalled()
    expect(result).toBe(MOCK_PUBLISH_COMMAND)
  })

  it('should use publishCommand in package.json if publishCommand not specified on cli', async () => {
    const MOCK_PUBLISH_COMMAND = 'publish_commands'
    promptSpy.mockReturnValue({ publishCommand: MOCK_PUBLISH_COMMAND })
    const CHALK_ARGS =
      'There is no publish command specified both on package.json. Please sepcified publish command'
    const PACKAGE_JSON_BUFFER = Buffer.from(
      JSON.stringify({
        test: 'test',
        ['version-pong']: {
          method: undefined,
        },
      }),
    )
    const PACKAGE_JSON_BUFFER_2 = Buffer.from(
      JSON.stringify({
        test: 'test',
        ['version-pong']: {},
      }),
    )
    const PACKAGE_JSON_BUFFER_3 = Buffer.from(
      JSON.stringify({
        test: 'test',
      }),
    )
    const EXPECT_FINAL_JSON_2 = JSON.stringify(
      {
        test: 'test',
        ['version-pong']: {
          method: MOCK_PUBLISH_COMMAND,
        },
      },
      null,
      '  ',
    )

    readFileSyncSpy
      .mockReturnValueOnce(PACKAGE_JSON_BUFFER)
      .mockReturnValueOnce(PACKAGE_JSON_BUFFER_2)
      .mockReturnValueOnce(PACKAGE_JSON_BUFFER_3)

    const result = await checkPublishMethod()

    expect(readFileSyncSpy).toBeCalledWith(PACKAGE_JSON)
    expect(chalkSpy).toBeCalledWith(CHALK_ARGS)
    expect(writeFileSyncSpy).toBeCalledWith(PACKAGE_JSON, EXPECT_FINAL_JSON_2)
    expect(result).toBe(MOCK_PUBLISH_COMMAND)

    const result2 = await checkPublishMethod()

    expect(readFileSyncSpy).toBeCalledWith(PACKAGE_JSON)
    expect(chalkSpy).toBeCalledWith(CHALK_ARGS)
    expect(writeFileSyncSpy).toBeCalledWith(PACKAGE_JSON, EXPECT_FINAL_JSON_2)
    expect(result2).toBe(MOCK_PUBLISH_COMMAND)

    const result3 = await checkPublishMethod()

    expect(readFileSyncSpy).toBeCalledWith(PACKAGE_JSON)
    expect(chalkSpy).toBeCalledWith(CHALK_ARGS)
    expect(writeFileSyncSpy).toBeCalledWith(PACKAGE_JSON, EXPECT_FINAL_JSON_2)
    expect(result3).toBe(MOCK_PUBLISH_COMMAND)
  })
})
