import jwt from 'jsonwebtoken'
const accessTokenSecret = process.env.APP_SECRET

export function signAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign({ payload }, accessTokenSecret, {
    }, (err, token) => {
      if (err) {
        reject("Something went wrong")
      }
      resolve(token)
    })
  })
}

export function verifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, accessTokenSecret, (err, payload) => {
      if (err) {
        const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message // short way of writing if else statement
        // if err.name is JsonWebTokenError then return Unauthorized
        return reject(message)
      }
      resolve(payload)
    })
  })
}