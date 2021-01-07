import * as watchPeerDependenciesType from '.'

describe('watchPeerDependencies', () => {
  const readFileSyncSpy = jest.fn()
  const writeFileSyncSpy = jest.fn()
  const consoleErrorSpy = jest.spyOn(console, 'error')

  jest.doMock('fs', () => ({
    readFileSync: readFileSyncSpy,
    writeFileSync: writeFileSyncSpy,
  }))

  afterEach(() => {
    jest.resetAllMocks()
  })

  const {
    default: watchPeerDependencies,
  } = require('.') as typeof watchPeerDependenciesType

  it('should be generate empty peerDependencies', () => {
    readFileSyncSpy.mockReturnValue(Buffer.from(JSON.stringify({})))

    watchPeerDependencies()

    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(
        {
          peerDependencies: {},
        },
        null,
        '  ',
      )}\n`,
    )
  })

  it('should be generate peerDependencies', () => {
    readFileSyncSpy.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          devDependencies: {
            test1: '^26.1.0',
            test2: '~26.1.0',
            test3: '26.1.0',
          },
          watchDependencies: ['test1', 'test2', 'test3'],
        }),
      ),
    )

    watchPeerDependencies()

    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(
        {
          devDependencies: {
            test1: '^26.1.0',
            test2: '~26.1.0',
            test3: '26.1.0',
          },
          watchDependencies: ['test1', 'test2', 'test3'],
          peerDependencies: {
            test1: '>=26.1.0',
            test2: '>=26.1.0',
            test3: '>=26.1.0',
          },
        },
        null,
        '  ',
      )}\n`,
    )
  })

  it('should not generate peerDependencies', () => {
    watchPeerDependencies()

    expect(writeFileSyncSpy).toBeCalledTimes(0)
    expect(consoleErrorSpy).toBeCalled()
  })

  it('should not generate to peerDependency. if dependency not in devDependencies', () => {
    readFileSyncSpy.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          devDependencies: {
            test1: '^26.1.0',
          },
          watchDependencies: ['test1', 'test2'],
        }),
      ),
    )

    watchPeerDependencies()

    expect(writeFileSyncSpy).toBeCalledWith(
      'package.json',
      `${JSON.stringify(
        {
          devDependencies: {
            test1: '^26.1.0',
          },
          watchDependencies: ['test1', 'test2'],
          peerDependencies: {
            test1: '>=26.1.0',
          },
        },
        null,
        '  ',
      )}\n`,
    )
  })
})
