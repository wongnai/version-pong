import { PublishLevel } from 'types'
import { DEFAULT_PUBLISH_COMMAND } from '../pongConstants'
import * as publishType from './'

describe('publish ', () => {
  const MOCK_TAG = '1.2'
  const GIT_PUSH_COMMAND = 'git push --follow-tags'
  const execaSpy = jest.fn()
  const spinnerSpy = jest.fn()
  const spinnerStartSpy = jest.fn()
  const spinnerSucceesSpy = jest.fn()
  const exitSpy = jest
    .spyOn(process, 'exit')
    .mockImplementation((() => ({})) as any)

  jest.doMock('execa', () => {
    const execa = execaSpy
    Object.defineProperty(execa, 'command', { value: execaSpy })
    return execa
  })

  const MOCK_PUBLISH_COMMAND = 'publish'

  beforeEach(() => {
    jest.doMock('ora', () => (arg: string) => {
      spinnerSpy(arg)
      const result = { start: spinnerStartSpy, succeed: spinnerSucceesSpy }
      spinnerStartSpy.mockReturnValue(result)
      spinnerSucceesSpy.mockReturnValue(result)
      return result
    })
  })

  afterEach(() => {
    execaSpy.mockReset()
    spinnerSpy.mockReset()
    spinnerStartSpy.mockReset()
    spinnerSucceesSpy.mockReset()

    jest.resetAllMocks()
  })

  it('call spinner success when the argument is valid with beta tag', async () => {
    const { default: publish } = require('.') as typeof publishType

    await publish(MOCK_PUBLISH_COMMAND, PublishLevel.BETA)

    const EXPECTED_SPINNER_START = 'Publishing Package...'
    expect(spinnerSpy).toBeCalledWith(EXPECTED_SPINNER_START)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    const RESULT_PUBLISH_COMMAND = `${MOCK_PUBLISH_COMMAND} --tag=beta`
    expect(execaSpy).toBeCalledWith('sh', ['-c', RESULT_PUBLISH_COMMAND])
    expect(execaSpy).toBeCalledWith(GIT_PUSH_COMMAND)
    expect(execaSpy).toBeCalledTimes(2)
    expect(spinnerSucceesSpy).toBeCalledTimes(1)
    expect(exitSpy).not.toBeCalled()
  })

  it('call spinner success when the argument is valid without beta tag', async () => {
    const { default: publish } = require('.') as typeof publishType

    await publish(MOCK_PUBLISH_COMMAND, PublishLevel.MAJOR)

    const EXPECTED_SPINNER_START = 'Publishing Package...'
    expect(spinnerSpy).toBeCalledWith(EXPECTED_SPINNER_START)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(execaSpy).toBeCalledWith('sh', ['-c', MOCK_PUBLISH_COMMAND])
    expect(execaSpy).toBeCalledWith(GIT_PUSH_COMMAND)
    expect(execaSpy).toBeCalledTimes(2)
    expect(spinnerSucceesSpy).toBeCalledTimes(1)
    expect(exitSpy).not.toBeCalled()
  })

  it('call spinner success when the argument is valid when there is no publish command', async () => {
    const { default: publish } = require('.') as typeof publishType

    await publish(undefined, PublishLevel.MAJOR)

    const EXPECTED_SPINNER_START = 'Publishing Package...'
    expect(spinnerSpy).toBeCalledWith(EXPECTED_SPINNER_START)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(execaSpy).toBeCalledWith('sh', ['-c', DEFAULT_PUBLISH_COMMAND])
    expect(execaSpy).toBeCalledWith(GIT_PUSH_COMMAND)
    expect(execaSpy).toBeCalledTimes(2)
    expect(spinnerSucceesSpy).toBeCalledTimes(1)
    expect(exitSpy).not.toBeCalled()
  })

  // tslint:disable-next-line: max-line-length
  it('should throw error and reset changelog.md when execa recieve wrong command in major and minor publish', async () => {
    execaSpy.mockImplementation(() => ({
      stdout: MOCK_TAG,
    }))
    execaSpy.mockImplementationOnce(() => {
      throw new Error('Boom')
    })
    const { default: publish } = require('.') as typeof publishType
    const WRONG_COMMAND = 'something wrong'
    const RESULT_PUBLISH_COMMAND = `${WRONG_COMMAND} --tag=beta`
    const EXPECT_EXECA_COMMAND = [
      ['sh', ['-c', RESULT_PUBLISH_COMMAND]],
      ['git describe --tags'],
      [`git tag -d ${MOCK_TAG}`],
      ['git checkout HEAD^ -- package.json'],
      ['git reset HEAD^ --soft'],
    ]

    await publish(WRONG_COMMAND, PublishLevel.BETA)

    const EXPECTED_SPINNER_START = 'Publishing Package...'
    expect(spinnerSpy).toBeCalledWith(EXPECTED_SPINNER_START)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(execaSpy.mock.calls).toEqual(EXPECT_EXECA_COMMAND)
    expect(exitSpy).toBeCalledTimes(1)
  })

  it('should throw error but not reset changelog.md when execa recieve wrong command in beta publish', async () => {
    execaSpy.mockImplementation(() => ({
      stdout: MOCK_TAG,
    }))
    execaSpy.mockImplementationOnce(() => {
      throw new Error('Boom')
    })
    const { default: publish } = require('.') as typeof publishType
    const WRONG_COMMAND = 'something wrong'
    const RESULT_PUBLISH_COMMAND = WRONG_COMMAND
    const EXPECT_EXECA_COMMAND = [
      ['sh', ['-c', RESULT_PUBLISH_COMMAND]],
      ['git describe --tags'],
      [`git tag -d ${MOCK_TAG}`],
      ['git checkout HEAD^ -- package.json'],
      ['git checkout HEAD^ -- CHANGELOG.md'],
      ['git reset HEAD^ --soft'],
    ]

    await publish(WRONG_COMMAND, PublishLevel.MINOR)

    const EXPECTED_SPINNER_START = 'Publishing Package...'
    expect(spinnerSpy).toBeCalledWith(EXPECTED_SPINNER_START)
    expect(spinnerStartSpy).toBeCalledTimes(1)
    expect(execaSpy.mock.calls).toEqual(EXPECT_EXECA_COMMAND)
    expect(exitSpy).toBeCalledTimes(1)
  })
})
