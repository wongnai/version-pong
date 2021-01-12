import * as getPackageJsonFromFileType from '.'

describe('getPackageJsonFromFile', () => {
  const readFileSyncSpy = jest.fn()
  jest.doMock('fs', () => ({
    readFileSync: readFileSyncSpy,
  }))

  const {
    default: getPackageJsonFromFile,
  } = require('.') as typeof getPackageJsonFromFileType

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return package.json object correctly', () => {
    const mockPackageJsonBuffer = Buffer.from(
      JSON.stringify({
        name: 'lodash',
        version: '1.0.1',
      }),
    )
    readFileSyncSpy.mockReturnValue(mockPackageJsonBuffer)

    const packageJson = getPackageJsonFromFile()

    expect(readFileSyncSpy).toBeCalledTimes(1)
    expect(readFileSyncSpy).toBeCalledWith('package.json')
    expect(packageJson).toEqual({
      name: 'lodash',
      version: '1.0.1',
    })
  })
})
