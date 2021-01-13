export enum PublishLevel {
  BETA = 'beta',
  PATCH = 'patch',
  MINOR = 'minor',
  MAJOR = 'major',
}

export interface PackageJson {
  name: string
  version: string
  ['version-pong']?: {
    method: string,
  }
  publishConfig?: {
    registry: string,
  }
  watchDependencies?: string[]
  peerDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}
