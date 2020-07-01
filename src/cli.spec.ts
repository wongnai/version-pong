import { startCommand } from 'start'

describe('cli', () => {
  const versionSpy = jest.fn()
  const descriptionSpy = jest.fn()
  const argumentsSpy = jest.fn()
  const actionSpy = jest.fn()
  const parseSpy = jest.fn()

  const MOCK_VERSION = '1.0.0'

  jest.doMock('commander', () => {
    const cli = {
      action: actionSpy,
      arguments: argumentsSpy,
      description: descriptionSpy,
      parse: parseSpy,
      version: versionSpy,
    }
    actionSpy.mockReturnValue(cli)
    argumentsSpy.mockReturnValue(cli)
    descriptionSpy.mockReturnValue(cli)
    parseSpy.mockReturnValue(cli)
    versionSpy.mockReturnValue(cli)
    return cli
  })

  jest.doMock('../package.json', () => ({ version: MOCK_VERSION }))

  it('should be able to call cli with correct arguments', () => {
    require('.')

    const EXPECTED_DESCRIPTION = 'Pong! NPM pacakge version before publishing'
    const EXPECTED_ARGUMENTS = '<level>'

    expect(versionSpy).toBeCalledWith(MOCK_VERSION, '-v, --version')
    expect(descriptionSpy).toBeCalledWith(EXPECTED_DESCRIPTION)
    expect(argumentsSpy).toBeCalledWith(EXPECTED_ARGUMENTS)
    expect(actionSpy).toBeCalledWith(startCommand)
    expect(parseSpy).toBeCalledWith(process.argv)
  })
})
