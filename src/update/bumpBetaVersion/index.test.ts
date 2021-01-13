import * as bumpBetaVersionType from '.'

describe('bumpBetaVersion', () => {
  const standardVersionSpy = jest.fn()
  jest.doMock('standard-version', () => standardVersionSpy)

  const spinnerSpy = jest.fn()
  const spinnerStartSpy = jest.fn()
  const spinnerSucceedSpy = jest.fn()
  const mockSpinner = (args: string) => {
    spinnerSpy(args)
    return {
      start: spinnerStartSpy,
      succeed: spinnerSucceedSpy,
    }
  }
  jest.doMock('ora', () => mockSpinner)

  const readFileSyncSpy = jest.fn()
  const writeFileSyncSpy = jest.fn()
  jest.doMock('fs', () => ({
    readFileSync: readFileSyncSpy,
    writeFileSync: writeFileSyncSpy,
  }))

  const commandSpy = jest.fn()
  jest.doMock('execa', () => ({
    command: commandSpy,
  }))

  const {
    default: bumpBetaVersion,
  } = require('.') as typeof bumpBetaVersionType

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should bump beta version correctly when it has not any beta version in npm package', async () => {
    const mockPackageJsonBuffer = Buffer.from(
      JSON.stringify({
        name: 'lodash',
        version: '1.0.1',
      }),
    )
    readFileSyncSpy.mockReturnValue(mockPackageJsonBuffer)
    commandSpy.mockReturnValue({ stdout: '' })

    const expectPackageJson = {
      name: 'lodash',
      version: '1.0.1',
    }

    await bumpBetaVersion()

    expect(spinnerSpy).toBeCalledTimes(1)
    expect(spinnerSpy).toBeCalledWith('Updating package.json...')
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledWith('npm view lodash@beta version')
    expect(writeFileSyncSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(expectPackageJson, null, 2)}\n`,
    )
    expect(standardVersionSpy).toBeCalledTimes(1)
    expect(standardVersionSpy).toBeCalledWith({
      prerelease: 'beta',
      skip: {
        changelog: true,
      },
      silent: true,
    })
  })

  it('should bump beta version correctly when it is latest version and equal beta version in npm package', async () => {
    const mockPackageJsonBuffer = Buffer.from(
      JSON.stringify({
        name: 'lodash',
        version: '1.0.1',
      }),
    )
    readFileSyncSpy.mockReturnValue(mockPackageJsonBuffer)
    commandSpy.mockReturnValue({ stdout: '1.0.1-beta.0' })

    const expectPackageJson = {
      name: 'lodash',
      version: '1.0.1-beta.0',
    }

    await bumpBetaVersion()

    expect(spinnerSpy).toBeCalledTimes(1)
    expect(spinnerSpy).toBeCalledWith('Updating package.json...')
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledWith('npm view lodash@beta version')
    expect(writeFileSyncSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(expectPackageJson, null, 2)}\n`,
    )
    expect(standardVersionSpy).toBeCalledTimes(1)
    expect(standardVersionSpy).toBeCalledWith({
      prerelease: 'beta',
      skip: {
        changelog: true,
      },
      silent: true,
    })
  })

  it('should bump beta version correctly when it is latest version but more than beta version in npm package', async () => {
    const mockPackageJsonBuffer = Buffer.from(
      JSON.stringify({
        name: 'lodash',
        version: '1.0.2',
      }),
    )
    readFileSyncSpy.mockReturnValue(mockPackageJsonBuffer)
    commandSpy.mockReturnValue({ stdout: '1.0.1-beta.0' })

    const expectPackageJson = {
      name: 'lodash',
      version: '1.0.2',
    }

    await bumpBetaVersion()

    expect(spinnerSpy).toBeCalledTimes(1)
    expect(spinnerSpy).toBeCalledWith('Updating package.json...')
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledWith('npm view lodash@beta version')
    expect(writeFileSyncSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(expectPackageJson, null, 2)}\n`,
    )
    expect(standardVersionSpy).toBeCalledTimes(1)
    expect(standardVersionSpy).toBeCalledWith({
      prerelease: 'beta',
      skip: {
        changelog: true,
      },
      silent: true,
    })
  })

  it('should bump beta version correctly when it is beta version and less than beta version in npm package', async () => {
    const mockPackageJsonBuffer = Buffer.from(
      JSON.stringify({
        name: 'lodash',
        version: '1.0.1-beta.0',
      }),
    )
    readFileSyncSpy.mockReturnValue(mockPackageJsonBuffer)
    commandSpy.mockReturnValue({ stdout: '1.0.1-beta.2' })

    const expectPackageJson = {
      name: 'lodash',
      version: '1.0.1-beta.2',
    }

    await bumpBetaVersion()

    expect(spinnerSpy).toBeCalledTimes(1)
    expect(spinnerSpy).toBeCalledWith('Updating package.json...')
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledWith('npm view lodash@beta version')
    expect(writeFileSyncSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(expectPackageJson, null, 2)}\n`,
    )
    expect(standardVersionSpy).toBeCalledTimes(1)
    expect(standardVersionSpy).toBeCalledWith({
      prerelease: 'beta',
      skip: {
        changelog: true,
      },
      silent: true,
    })
  })

  it('should bump beta version correctly when it will publish to private registry', async () => {
    const mockPackageJsonBuffer = Buffer.from(
      JSON.stringify({
        name: 'lodash',
        version: '1.0.1',
        publishConfig: {
          registry: 'https://registry.npmjs.org',
        },
      }),
    )
    readFileSyncSpy.mockReturnValue(mockPackageJsonBuffer)
    commandSpy.mockReturnValue({ stdout: '' })

    const expectPackageJson = {
      name: 'lodash',
      version: '1.0.1',
      publishConfig: {
        registry: 'https://registry.npmjs.org',
      },
    }

    await bumpBetaVersion()

    expect(spinnerSpy).toBeCalledTimes(1)
    expect(spinnerSpy).toBeCalledWith('Updating package.json...')
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledWith(
      'npm view lodash@beta version --registry=https://registry.npmjs.org',
    )
    expect(writeFileSyncSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(expectPackageJson, null, 2)}\n`,
    )
    expect(standardVersionSpy).toBeCalledTimes(1)
    expect(standardVersionSpy).toBeCalledWith({
      prerelease: 'beta',
      skip: {
        changelog: true,
      },
      silent: true,
    })
  })

  it('should bump beta version correctly with tag prefix', async () => {
    const mockPackageJsonBuffer = Buffer.from(
      JSON.stringify({
        name: 'lodash',
        version: '1.0.1',
      }),
    )
    readFileSyncSpy.mockReturnValue(mockPackageJsonBuffer)
    commandSpy.mockReturnValue({ stdout: '' })

    const expectPackageJson = {
      name: 'lodash',
      version: '1.0.1',
    }

    await bumpBetaVersion({
      tagPrefix: 'prefix@',
    })

    expect(spinnerSpy).toBeCalledTimes(1)
    expect(spinnerSpy).toBeCalledWith('Updating package.json...')
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledTimes(1)
    expect(commandSpy).toBeCalledWith('npm view lodash@beta version')
    expect(writeFileSyncSpy).toBeCalledTimes(1)
    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(expectPackageJson, null, 2)}\n`,
    )
    expect(standardVersionSpy).toBeCalledTimes(1)
    expect(standardVersionSpy).toBeCalledWith({
      prerelease: 'beta',
      skip: {
        changelog: true,
      },
      silent: true,
      tagPrefix: 'prefix@',
    })
  })
})
