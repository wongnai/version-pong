import fs from 'fs'

import { PackageJson } from './types'
import addPrefixVersionOfPeerDependency from './utils/addPrefixVersionOfPeerDependency'

const watchPeerDependencies = () => {
  try {
    const packageJSON = JSON.parse(
      fs.readFileSync('package.json').toString(),
    ) as PackageJson

    packageJSON.peerDependencies =
      packageJSON?.watchDependencies?.reduce(
        (peerDepdendencies, watchedDependencyKey) => {
          const devDependency =
            packageJSON.devDependencies?.[watchedDependencyKey]
          if (!devDependency) {
            return { ...peerDepdendencies }
          }
          return {
            ...peerDepdendencies,
            [watchedDependencyKey]: addPrefixVersionOfPeerDependency(
              devDependency,
            ),
          }
        },
        {},
      ) || {}

    fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, '  '))
  } catch (error) {
    console.error(error)
    console.log('WatchPeerDependencies failure')
    return
  }
}

export default watchPeerDependencies
