const { generateToken } = require('./_auth')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body || {}
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' })
  }

  const token = generateToken()
  return res.status(200).json({ token })
}
