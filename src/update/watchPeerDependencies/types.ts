export interface PackageJson {
  watchedDependencies?: string[]
  peerDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}
