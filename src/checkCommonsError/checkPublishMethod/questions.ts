import { DEFAULT_PUBLISH_COMMAND } from 'pongConstants'

export const questions = [
  {
    default: DEFAULT_PUBLISH_COMMAND,
    message: `Publish Command for this project')`,
    name: 'publishCommand',
    type: 'input',
  },
]
