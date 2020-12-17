import addPrefixVersionOfPeerDependency from '.'

describe('addPrefixVersionOfPeerDependency', () => {
  it('should be return empty string', () => {
    expect(addPrefixVersionOfPeerDependency(null as any)).toBe('')
  })

  it('should return version with prefix', () => {
    expect(addPrefixVersionOfPeerDependency('2.0.0')).toBe('>=2.0.0')
    expect(addPrefixVersionOfPeerDependency('~2.0.0')).toBe('>=2.0.0')
    expect(addPrefixVersionOfPeerDependency('^2.0.0')).toBe('>=2.0.0')
  })
})
