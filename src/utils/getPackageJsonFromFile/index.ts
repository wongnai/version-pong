import fs from 'fs'
import { PackageJson } from 'types'

function getPackageJsonFromFile(): PackageJson {
  return JSON.parse(fs.readFileSync('package.json').toString())
}

export default getPackageJsonFromFile
