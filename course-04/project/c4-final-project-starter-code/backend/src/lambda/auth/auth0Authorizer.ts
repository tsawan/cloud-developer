import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://tahir-sless.auth0.com/.well-known/jwks.json'
const cert = `-----BEGIN CERTIFICATE-----
MIIDBTCCAe2gAwIBAgIJIOcyvSh842AgMA0GCSqGSIb3DQEBCwUAMCAxHjAcBgNV
BAMTFXRhaGlyLXNsZXNzLmF1dGgwLmNvbTAeFw0yMDAzMTYwODE5MDJaFw0zMzEx
MjMwODE5MDJaMCAxHjAcBgNVBAMTFXRhaGlyLXNsZXNzLmF1dGgwLmNvbTCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMazlM3KNU182KHNRNGWIKAaxK+v
Yl7EeBW0rJ0DKrqD1lcCYyAx567MYhxKiu3yaFF3fruHYADpg7xYNH9R9fKvE3n+
KZaqznjXRslTlYcyUVk5LkV62ykrZmVVuBx+CbrqPDAunruRbGSR26Zl+0+t+2xu
0ZCbZV/I1NsjQuJ66TqN+7VNwQdUF479KnNx3IoR3HghOGoiEc1Cu2QgLoAlKeG/
BY79NyDE1fyKnT7frJrgqPZ13wCgXF7ZC0bS47rjKOLuTJJsHtECs5KE/b4p9oaQ
BbjyrHbhRY8tZzJrQxD9H44GlQ2fvmxq4MQ0Hht6JWTDCHn/Fd+Dc50/QicCAwEA
AaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUdKxjFoRgXLPDHeUhfMaw
zj044OMwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAodV3GYOH4
07lSDNmCNGVJeJdQM7zrY1h0o8INFzZPqG7aZCN60vu+eHM5U1r2KtYVO0wy38mN
rJWbp0jYj+idog3TEpjLvzcwg5qaIomrqYDYBTuCcl+0Oj8fqKoW+/1Uexz3Zn8i
nCaG5VTikOjQq3ahFWffLBKvmj7r+WgTBC6yRFC3VOeM5TIZuBTpoPNib/KAwRQS
Tn2NcFzmTycwVaW2JMjGAAcjEoUCKF9xfwNr4wiEn8pYdlz2pchKJhfPCl1vQNl2
vKlc+MnmX63LRp8Y0of/EG7U1QUn31x17h/ZHc3FuDruucN9GvJXLZ3wegv6mxq9
/HW6hV5X6hbI
-----END CERTIFICATE-----
`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  //const token = getToken(authHeader)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  //return verify(token, cert, {algorithms: ['HS256']}) as JwtPayload
  //return undefined
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}
