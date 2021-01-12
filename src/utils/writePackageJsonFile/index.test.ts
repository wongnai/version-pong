import { PackageJson } from 'types'
import * as writePackageJsonFileType from '.'

describe('writePackageJsonFile', () => {
  const writeFileSyncSpy = jest.fn()
  jest.doMock('fs', () => ({
    writeFileSync: writeFileSyncSpy,
  }))

  const {
    default: writePackageJsonFile,
  } = require('.') as typeof writePackageJsonFileType

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should write package.json file from packageJson object correctly', () => {
    const packageJson: PackageJson = {
      name: 'lodash',
      version: '1.0.1',
    }

    writePackageJsonFile(packageJson)

    expect(writeFileSyncSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(packageJson, null, '  ')}\n`,
    )
  })
})
