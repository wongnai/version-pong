import { PublishLevel } from 'types'

import * as checkForBranchErrorType from '.'
import { questions } from './questions'

describe('checkForBranchError', () => {
  const MOCK_CHALK_RETURN = 'WONGNAI'
  const MOCK_CORRECT_BRANCH = 'master'
  const MOCK_WRONG_BRANCH = 'feat/init-project'

  const EXECA_ARGS = `git rev-parse --abbrev-ref HEAD`

  const execaSpy = jest.fn()
  const chalkSpy = jest.fn()
  const promptSpy = jest.fn()
  const consoleLogSpy = jest.spyOn(console, 'log')
  const processExitSpy = jest.spyOn(process, 'exit')

  jest.doMock('execa', () => execaSpy)
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

  const {
    default: checkForBranchError,
  } = require('.') as typeof checkForBranchErrorType
  // tslint:disable-next-line: max-line-length
  it('should prompt warning when not on prefered branch to publish and terminate process if answer is no', async () => {
    execaSpy.mockReturnValue({ stdout: MOCK_WRONG_BRANCH })
    promptSpy.mockReturnValue({ continue: false })
    const CHALK_ARGS = `you are currently in branch 'feat/init-project'. The prefered branch to publish with beta tag is 'dev'\n`

    await checkForBranchError(PublishLevel.BETA)

    expect(execaSpy).toBeCalledWith(EXECA_ARGS)
    expect(execaSpy).toBeCalledTimes(1)
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
  it('should prompt warning when not on prefered branch to publish and not terminate process if answer is yes', async () => {
    execaSpy.mockReturnValue({ stdout: MOCK_WRONG_BRANCH })
    promptSpy.mockReturnValue({ continue: true })
    const CHALK_ARGS = `you are currently in branch 'feat/init-project'. The prefered branch to publish with beta tag is 'dev'\n`

    await checkForBranchError(PublishLevel.BETA)

    expect(execaSpy).toBeCalledWith(EXECA_ARGS)
    expect(execaSpy).toBeCalledTimes(1)
    expect(chalkSpy).toBeCalledWith(CHALK_ARGS)
    expect(chalkSpy).toBeCalledTimes(1)
    expect(consoleLogSpy).toBeCalledWith(MOCK_CHALK_RETURN)
    expect(consoleLogSpy).toBeCalledTimes(1)
    expect(promptSpy).toBeCalledWith(questions)
    expect(promptSpy).toBeCalledTimes(1)
    expect(processExitSpy).not.toBeCalled()
  })

  it('should not prompt warning when on prefered branch', async () => {
    execaSpy.mockReturnValue({ stdout: MOCK_CORRECT_BRANCH })

    await checkForBranchError(PublishLevel.MINOR)

    expect(execaSpy).toBeCalledWith(EXECA_ARGS)
    expect(execaSpy).toBeCalledTimes(1)
    expect(chalkSpy).not.toBeCalled()
    expect(consoleLogSpy).not.toBeCalled()
    expect(promptSpy).not.toBeCalled()
    expect(processExitSpy).not.toBeCalled()
  })
})
