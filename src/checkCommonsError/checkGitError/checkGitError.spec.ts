import { GIT_MIN_VERSION } from 'pongConstants'
import { PublishLevel } from 'types'

import * as checkGitErrorType from './'
import { questions } from './questions'

describe('checkGitError', () => {
  const MOCK_CHALK_RETURN = 'WONGNAI'
  const MOCK_CORRECT_BRANCH = 'master'
  const MOCK_WRONG_BRANCH = 'feat/init-project'
  const MOCK_RIGHT_VERSION = '2.2.14'

  const EXECA_ARGS = `git --version`
  const EXECA_ARGS2 = `git rev-parse --abbrev-ref HEAD`
  const EXECA_ARGS3 = 'git status --porcelain'
  const EXECA_ARGS4 = 'git pull'

  const execaSpy = jest.fn()
  const chalkSpy = jest.fn()
  const promptSpy = jest.fn()
  const consoleLogSpy = jest.spyOn(console, 'log')
  const processExitSpy = jest.spyOn(process, 'exit')

  jest.doMock('execa', () => ({ command: execaSpy }))
  jest.doMock('chalk', () => ({ red: { bold: chalkSpy } }))
  jest.doMock('inquirer', () => ({ prompt: promptSpy }))

  beforeEach(() => {
    chalkSpy.mockReturnValue(MOCK_CHALK_RETURN)
    processExitSpy.mockImplementation((() => ({})) as any)
  })

  afterEach(() => {
    chalkSpy.mockReset()
    promptSpy.mockReset()
    execaSpy.mockReset()
    consoleLogSpy.mockReset()
    processExitSpy.mockReset()
  })

  const { default: checkGitError } = require('.') as typeof checkGitErrorType
  // tslint:disable-next-line: max-line-length
  it('should prompt warning when not on prefered branch to publish and terminate process if answer is no | no uncommited changes', async () => {
    execaSpy
      .mockReturnValueOnce({ stdout: MOCK_RIGHT_VERSION })
      .mockReturnValueOnce({ stdout: MOCK_WRONG_BRANCH })
      .mockReturnValueOnce({ stdout: '' })
    promptSpy.mockReturnValue({ continue: false })
    const CHALK_ARGS = `you are currently in branch 'feat/init-project'. The prefered branch to publish with beta tag is 'dev'\n`

    await checkGitError(PublishLevel.BETA)

    expect(execaSpy.mock.calls[0][0]).toEqual(EXECA_ARGS)
    expect(execaSpy.mock.calls[1][0]).toEqual(EXECA_ARGS2)
    expect(execaSpy.mock.calls[2][0]).toEqual(EXECA_ARGS3)
    expect(execaSpy.mock.calls[3][0]).toEqual(EXECA_ARGS4)
    expect(execaSpy).toBeCalledTimes(4)
    expect(chalkSpy).toBeCalledWith(CHALK_ARGS)
    expect(chalkSpy).toBeCalledTimes(1)
    expect(consoleLogSpy).toBeCalledWith(MOCK_CHALK_RETURN)
    expect(consoleLogSpy).toBeCalledTimes(1)
    expect(promptSpy).toBeCalledWith(questions)
    expect(promptSpy).toBeCalledTimes(1)
    expect(processExitSpy).toBeCalledWith(1)
    expect(processExitSpy).toBeCalledTimes(1)
  })

  // tslint:disable-next-line: max-line-length
  it('should prompt warning when not on prefered branch to publish and not terminate process if answer is yes | no uncommited changes', async () => {
    execaSpy
      .mockReturnValueOnce({ stdout: MOCK_RIGHT_VERSION })
      .mockReturnValueOnce({ stdout: MOCK_WRONG_BRANCH })
      .mockReturnValueOnce({ stdout: '' })
    promptSpy.mockReturnValue({ continue: true })
    const CHALK_ARGS = `you are currently in branch 'feat/init-project'. The prefered branch to publish with beta tag is 'dev'\n`

    await checkGitError(PublishLevel.BETA)

    expect(execaSpy.mock.calls[0][0]).toEqual(EXECA_ARGS)
    expect(execaSpy.mock.calls[1][0]).toEqual(EXECA_ARGS2)
    expect(execaSpy.mock.calls[2][0]).toEqual(EXECA_ARGS3)
    expect(execaSpy.mock.calls[3][0]).toEqual(EXECA_ARGS4)
    expect(execaSpy).toBeCalledTimes(4)
    expect(chalkSpy).toBeCalledWith(CHALK_ARGS)
    expect(chalkSpy).toBeCalledTimes(1)
    expect(consoleLogSpy).toBeCalledWith(MOCK_CHALK_RETURN)
    expect(consoleLogSpy).toBeCalledTimes(1)
    expect(promptSpy).toBeCalledWith(questions)
    expect(promptSpy).toBeCalledTimes(1)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should not prompt warning when on prefered branch | no uncommited changes', async () => {
    execaSpy
      .mockReturnValueOnce({ stdout: MOCK_RIGHT_VERSION })
      .mockReturnValueOnce({ stdout: MOCK_CORRECT_BRANCH })
      .mockReturnValueOnce({ stdout: '' })

    await checkGitError(PublishLevel.MINOR)

    expect(execaSpy.mock.calls[0][0]).toEqual(EXECA_ARGS)
    expect(execaSpy.mock.calls[1][0]).toEqual(EXECA_ARGS2)
    expect(execaSpy.mock.calls[2][0]).toEqual(EXECA_ARGS3)
    expect(execaSpy.mock.calls[3][0]).toEqual(EXECA_ARGS4)
    expect(execaSpy).toBeCalledTimes(4)
    expect(chalkSpy).not.toBeCalled()
    expect(consoleLogSpy).not.toBeCalled()
    expect(promptSpy).not.toBeCalled()
    expect(processExitSpy).not.toBeCalled()
  })

  it('should not prompt warning when on prefered branch | have uncommited changes', async () => {
    const UNCOMMITED_FILES = 'name'
    const EXPECTED_ERROR_MESSAGE =
      'some files or directories are not commited:\nname'
    execaSpy
      .mockReturnValueOnce({ stdout: MOCK_RIGHT_VERSION })
      .mockReturnValueOnce({ stdout: MOCK_CORRECT_BRANCH })
      .mockReturnValueOnce({ stdout: UNCOMMITED_FILES })

    try {
      await checkGitError(PublishLevel.MINOR)
    } catch (e) {
      expect(e.message).toMatch(EXPECTED_ERROR_MESSAGE)
    }

    expect(execaSpy.mock.calls[0][0]).toEqual(EXECA_ARGS)
    expect(execaSpy.mock.calls[1][0]).toEqual(EXECA_ARGS2)
    expect(execaSpy.mock.calls[2][0]).toEqual(EXECA_ARGS3)
    expect(execaSpy).toBeCalledTimes(3)
    expect(chalkSpy).not.toBeCalled()
    expect(consoleLogSpy).not.toBeCalled()
    expect(promptSpy).not.toBeCalled()
    expect(processExitSpy).not.toBeCalled()
  })

  it('should throw error if git version is lower than prefered', async () => {
    const EXPECTED_ERROR_MESSAGE = `You need at least git version ${GIT_MIN_VERSION} to use version-pong`
    const MOCK_WRONG_VERSION = '2.2.1'
    execaSpy.mockReturnValueOnce({ stdout: MOCK_WRONG_VERSION })

    try {
      await checkGitError(PublishLevel.MINOR)
    } catch (e) {
      expect(e.message).toMatch(EXPECTED_ERROR_MESSAGE)
    }

    expect(execaSpy).toBeCalledWith(EXECA_ARGS)
    expect(execaSpy).toBeCalledTimes(1)
    expect(chalkSpy).not.toBeCalled()
    expect(consoleLogSpy).not.toBeCalled()
    expect(promptSpy).not.toBeCalled()
    expect(processExitSpy).not.toBeCalled()
  })
})
