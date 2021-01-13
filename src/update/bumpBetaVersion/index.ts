import execa from 'execa'
import fs from 'fs'
import isEmpty from 'lodash/isEmpty'
import Spinner from 'ora'
import semver from 'semver'
import standardVersion from 'standard-version'
import { PublishLevel } from 'types'
import getPackageJsonFromFile from 'utils/getPackageJsonFromFile'
import writePackageJsonFile from 'utils/writePackageJsonFile'

async function bumpBetaVersion(prefixObj?: Record<string, any>) {
  const bumpBetaSpinner = Spinner('Updating package.json...')
  bumpBetaSpinner.start()

  const packageJson = getPackageJsonFromFile()
  const packageName = packageJson.name

  let versionOnRegistry: string | null

  const registry = packageJson.publishConfig?.registry
  const publishWithRegistryCommand = `npm view ${packageName}@beta version --registry=${registry}`
  const publishCommand = `npm view ${packageName}@beta version`

  const { stdout: version } = await execa.command(
    registry ? publishWithRegistryCommand : publishCommand,
  )
  versionOnRegistry = version

  if (!isEmpty(versionOnRegistry)) {
    const BETA_VERSION_REGX = /-beta.*\w+/g
    const latestVersionOnRegistry = versionOnRegistry.replace(
      BETA_VERSION_REGX,
      '',
    )
    const latestVersionOnPackage = packageJson.version.replace(
      BETA_VERSION_REGX,
      '',
    )
    const isEqualLatestVersion = semver.eq(
      latestVersionOnPackage,
      latestVersionOnRegistry,
    )
    if (isEqualLatestVersion) {
      packageJson.version = versionOnRegistry
    }
  }

  const packageJsonString = JSON.stringify(packageJson, null, 2)
  writePackageJsonFile(packageJson)

  await standardVersion({
    prerelease: PublishLevel.BETA,
    skip: {
      changelog: true,
    },
    silent: true,
    ...prefixObj,
  })

  bumpBetaSpinner.succeed()
}

export default bumpBetaVersion
