const { Redis } = require('@upstash/redis')
const kv = new Redis({ url: process.env.kv_KV_REST_API_URL, token: process.env.kv_KV_REST_API_TOKEN })

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  try {
    const productos = await kv.get('luli:productos') || []
    return res.status(200).json(productos)
  } catch (err) {
    console.error('productos GET error:', err)
    return res.status(500).json({ error: 'Error al obtener productos.' })
  }
}
