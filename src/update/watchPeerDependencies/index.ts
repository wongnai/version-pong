import fs from 'fs'
import getPackageJsonFromFile from 'utils/getPackageJsonFromFile'
import writePackageJsonFile from 'utils/writePackageJsonFile'

import addPrefixVersionOfPeerDependency from './utils/addPrefixVersionOfPeerDependency'

const watchPeerDependencies = () => {
  try {
    const packageJSON = getPackageJsonFromFile()

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

    writePackageJsonFile(packageJSON)
  } catch (error) {
    console.error(error)
    console.log('WatchPeerDependencies failure')
    return
  }
}

export default watchPeerDependencies
