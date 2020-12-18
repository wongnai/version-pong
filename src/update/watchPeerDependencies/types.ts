export interface PackageJson {
  watchDependencies?: string[]
  peerDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}
