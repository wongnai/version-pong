import isEmpty from 'lodash/isEmpty'

import { GREATER_THAN_EQUAL, REGULAR } from './constants'

const addPrefixVersionOfPeerDependency = (version: string) => {
  if (isEmpty(version)) { return '' }
  return REGULAR.test(version[0])
    ? version.replace(REGULAR, GREATER_THAN_EQUAL)
    : `${GREATER_THAN_EQUAL}${version}`
}

export default addPrefixVersionOfPeerDependency
