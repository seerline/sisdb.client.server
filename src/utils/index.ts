import { RedisOptions } from 'ioredis'

const fs = require('fs')
const path = require('path')

export function split (str: string) {
  const results = []
  let word = ''
  let validWord
  for (let i = 0; i < str.length;) {
    if (/\s/.test(str[i])) {
      // Skips spaces.
      while (i < str.length && /\s/.test(str[i])) {
        i++
      }
      results.push(word)
      word = ''
      validWord = false
      continue
    }

    if (str[i] === '"') {
      i++
      while (i < str.length) {
        if (str[i] === '"') {
          validWord = true
          break
        }

        if (str[i] === '\\') {
          i++
          word += str[i++]
          continue
        }

        word += str[i++]
      }
      i++
      continue
    }

    if (str[i] === '\'') {
      i++
      while (i < str.length) {
        if (str[i] === '\'') {
          validWord = true
          break
        }

        if (str[i] === '\\') {
          i++
          word += str[i++]
          continue
        }

        word += str[i++]
      }
      i++
      continue
    }

    if (str[i] === '\\') {
      i++
      word += str[i++]
      continue
    }
    validWord = true
    word += str[i++]
  }
  if (validWord) {
    results.push(word)
  }
  return results
}

export function distinct (items: string[]) {
  const hash: {
    [key: string]: boolean;
  } = {}
  items.forEach(function (item) {
    hash[item] = true
  })
  const result = []
  for (const item of items) {
    result.push(item)
  }
  return result
}

const entityTable: {
  [key: number]: string,
} = {
  34: 'quot',
  38: 'amp',
  39: 'apos',
  60: 'lt',
  62: 'gt',
}

export function encodeHTMLEntities (str: string) {
  return str.replace(/[\u00A0-\u2666<>\&]/g, function (c) {
    return '&' +
      (entityTable[c.charCodeAt(0)] || '#' + c.charCodeAt(0)) + ';'
  })
}

const decodeEntityTable: {
  [key: string]: number,
} = {
  quot: 34,
  amp: 38,
  apos: 39,
  lt: 60,
  gt: 62,
}

export function decodeHTMLEntities (str: string) {
  return str.replace(/\&(\w)*\;/g, function (c) {
    return String.fromCharCode(decodeEntityTable[c.substring(1, c.indexOf('\;'))])
  })
}

// // Gets the last element of an array.
// export function addElement (newElem) {
//   this.push(newElem)
//   return this
// }

// Config Util functions
export async function getConfig () {
  const configPath = getConfigPath()
  try {
    const data = await fs.readFile(configPath, 'utf8')
    const config = JSON.parse(data)
    return config
  } catch (e) {
    return 'Failed to unserialize configuration at ' + configPath + ': ' + e.message
  }
}

export async function saveConfig (config: object) {
  const data = await fs.writeFile(getConfigPath(), JSON.stringify(config))
  return data
}

export async function deleteConfig () {
  await fs.unlink(getConfigPath())
}

export function defaultConfig () {
  return {
    sidebarWidth: 250,
    locked: false,
    CLIHeight: 50,
    CLIOpen: false,
    default_connections: [],
  }
}

export function containsConnection (connectedOptions: RedisOptions[], option: RedisOptions) {
  let contains = false
  connectedOptions.forEach(function (element) {
    if (element.host === option.host && element.port === option.port) {
      // dbIndex for configuration item
      // db for ioredis client option option
      if (typeof element.db !== 'undefined' && element.db === option.db) {
        contains = true
      } else if (typeof element.db !== 'undefined' && element.db === option.db) {
        contains = true
      }
    }
  })
  return contains
}

function getConfigPath () {
  let homePath = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
  if (typeof homePath === 'undefined') {
    console.info('Home directory not found for configuration file. Using current directory as fallback.')
    homePath = '.'
  }
  return path.join(homePath, '.redis-commander')
}
