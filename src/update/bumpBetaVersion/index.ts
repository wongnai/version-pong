import execa from 'execa'
import fs from 'fs'
import Spinner from 'ora'
import semver from 'semver'
import VerEx from 'verbal-expressions'

const bumpBetaVersion = async (spinner: typeof Spinner, tagPrefix?: string) => {
  const spinner$ = spinner('Updating package.json...').start()
  const packageJson = JSON.parse(fs.readFileSync('package.json').toString())
  const versionNumberTester = VerEx()
    .digit()
    .oneOrMore()
    .then('.')
    .digit()
    .oneOrMore()
    .then('.')
    .digit()
    .oneOrMore()
    .endOfLine()
  if (!versionNumberTester.test(packageJson.version)) {
    throw new Error('Version number should be in format XX.XX.XX digit only')
  }

  const { stdout: versionOnRegistry } = await execa.command(
    `npm view ${packageJson.name}@beta version --registry=${packageJson.publishConfig.registry}`,
  )

  if (versionOnRegistry) {
    const isLowerThanRegistryVersion = semver.lt(
      packageJson.version,
      versionOnRegistry,
    )
    if (isLowerThanRegistryVersion) {
      packageJson.version = versionOnRegistry
    }
  }

  const versionNumber: number[] = packageJson.version.split('.').map(Number)
  versionNumber[2]++
  packageJson.version = versionNumber.join('.')

  const stringifyResult = JSON.stringify(packageJson, null, '  ')
  fs.writeFileSync('package.json', stringifyResult)
  await execa.command(`git add package.json`)
  if (tagPrefix) {
    await execa.command(
      `git commit -m "chore(release-beta):\\${tagPrefix}@${packageJson.version}"`,
    )
    await execa.command(`git tag ${tagPrefix}@${packageJson.version}`)
  } else {
    await execa.command(
      `git commit -m "chore(release-beta):\\${packageJson.version}"`,
    )
    await execa.command(`git tag v${packageJson.version}`)
  }
  spinner$.succeed()
}

export default bumpBetaVersion
