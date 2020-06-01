var jwt = require("jsonwebtoken")

module.exports = secret => {
  const createToken = data => jwt.sign(data, secret)
  const verifyToken = (token, handler) => jwt.verify(token, secret, handler)

  return {
    createToken,
    verifyToken
  }
}
