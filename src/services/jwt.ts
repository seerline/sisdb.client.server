import * as crypto from 'crypto'
import jwt from 'jsonwebtoken'
const usedTokens = new Set()

const jwtSecret = crypto.randomBytes(20).toString('base64')

export interface TokenData {
  singleUse?: boolean
  exp?: number
}

export async function jwtSign (data: TokenData) {
  return jwt.sign(data, jwtSecret, {
    issuer: 'Redis Commander',
    subject: 'Session Token',
    expiresIn: 60,
  })
}

export async function jwtVerify (token: string) {
  try {
    const decodedToken = await jwt.verify(token, jwtSecret, {
      issuer: 'Redis Commander',
      subject: 'Session Token',
    }) as TokenData

    if (decodedToken.singleUse) {
      if (usedTokens.has(token)) {
        console.info('Single-Usage token already used')
        return false
      }
      usedTokens.add(token)
      if (decodedToken.exp) {
        setTimeout(() => {
          usedTokens.delete(token)
        }, ((decodedToken.exp * 1 + 10) * 1e3) - new Date().getTime())
      }
    }
  } catch (error) {
    return false
  }
}
