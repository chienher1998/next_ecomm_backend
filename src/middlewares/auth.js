import { verifyAccessToken } from '../utils/jwt.js'

export default async function auth(req, res, next) {
  if (!req.headers.authorization) {//if request header authorization's value is empty then do below
    return res.status(401).send({'error': 'Unauthorized'})
  }

  const token = req.headers.authorization.split(' ')[1] //go make a request to /users then click on timeline, 
  //it splits bearer string and token apart to get the token
  if (!token) {
    return res.status(401).send({ 'error': 'Unauthorized' })
  }

  await verifyAccessToken(token).then(user => {
    req.user = user // store the user in the `req` object. our next route now has access to the user via `req.user`
    next() // this is to run the next function in the app.function after verifying the token
  }).catch(e => {
    return res.status(401).send({ 'error': e.message })
  })
}