const crypto = require('crypto')

function getDateString() {
  return new Date().toISOString().slice(0, 10)
}

function generateToken() {
  const secret = process.env.SERVER_SECRET || process.env.ADMIN_PASSWORD || 'fallback'
  const message = (process.env.ADMIN_PASSWORD || '') + ':' + getDateString()
  return crypto.createHmac('sha256', secret).update(message).digest('hex')
}

function verifyRequest(req) {
  const auth = req.headers['authorization'] || ''
  if (!auth.startsWith('Bearer ')) return false
  const token = auth.slice(7)
  return token === generateToken()
}

module.exports = { generateToken, verifyRequest }
