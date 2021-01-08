# Version-Pong

Publish npm package and automated bump version in the package.json based on Standard Version.

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
    }
}
```

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
