# Version-Pong

Publish npm package and automated bump version in the package.json based on Standard Version.

## Version Pong Abilities

4 Steps will be performed in 1 Command!

1. Update Peer Dependencies versions
2. Tagging Version and Generate Auto Changelog
3. Publish to npm registry
4. Push all release change to target branch

## Installation

### As Global CLI

```bash
$ yarn global add version-pong
```

### Local Project

```bash
$ yarn add -D version-pong
```

In `package.json`

```json
{
    "scripts": {
        "release": "version-pong"
    },
    "version-pong": {
      "method": "yarn build && yarn publish"
    }
}
```

#### Settings

* method - The method that perform for publishing library

### Peer Dependencies 

If you need to generate Peer Dependencies.

add `library name` to `watchDependencies`.

example

In `package.json`

```json
{
    "devDependencies": {
      "jest": "^26.0.1",
    },
    "watchDependencies": ["jest"]
}
```

When ran command. you get Peer Dependencies.

example

In `package.json`

```json
{
    "devDependencies": {
      "jest": "^26.0.1",
    },
    "watchDependencies": ["jest"],
    "peerDependencies": {
      "jest": ">=26.0.1",
    }
}
```

#### Settings

* watchDependencies - List of `devDependencies` to be convert to `peerDependencies`.
* peerDependencies -  Generate `>=xx.xx.xx` version format.

### What is Peer Dependencies?

[Peer Dependencies](https://nodejs.org/es/blog/npm/peer-dependencies/)

## Usage

### Publish Library

```bash
$ version-pong <tag>
```

example

```bash
$ version-pong minor
```

#### Publish with git tagPrefix

```bash
$ version-pong <tag> -t <tagPrefix>
```

example

```bash
$ version-pong minor -t eslint
```

## Tag

### Production Release (Master Branch Only)

* Major - Breaking Change Release
* Minor - Non-Breaking Change Release
* Patch - Bug fix Release

### Development Release (Dev Branch Only)

* Beta - Development Release

## Option

- -t , --tagPrefix : git tag prefix
  - **ex.** eslint@1.1.1 (tagPrefix is eslint)


# Contributors ✨

* Norapat Buppodom - [new5558](https://github.com/new5558)
* Phasin Sarunpornkul - [gunhappy](https://github.com/gunhappy)
* Thanadej Phadtong - [Thanadej8](https://github.com/Thanadej8)
* Voraton Lertrattanapaisal - [ReiiYuki](https://github.com/ReiiYuki)
* LINE MAN Wongnai Frontend Team
