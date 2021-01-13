import fs from 'fs'
import { PackageJson } from 'types'

function writePackageJsonFile(packageJSON: PackageJson) {
  fs.writeFileSync('package.json', `${JSON.stringify(packageJSON, null, 2)}\n`)
}

export default writePackageJsonFile
