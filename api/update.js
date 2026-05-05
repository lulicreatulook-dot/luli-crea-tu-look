const { kv } = require('@vercel/kv')
const { verifyRequest } = require('./_auth')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!verifyRequest(req)) return res.status(401).json({ error: 'No autorizado.' })

  const { type, data, id, disponible } = req.body || {}

  try {
    if (type === 'config') {
      const current = (await kv.get('luli:config')) || {}
      await kv.set('luli:config', { ...current, ...data })
      return res.status(200).json({ ok: true })
    }

    if (type === 'producto-update') {
      const productos = (await kv.get('luli:productos')) || []
      const idx = productos.findIndex(p => p.id === data.id)
      if (idx >= 0) {
        productos[idx] = { ...productos[idx], ...data }
      } else {
        productos.push(data)
      }
      await kv.set('luli:productos', productos)
      return res.status(200).json({ ok: true })
    }

    if (type === 'producto-delete') {
      const productos = (await kv.get('luli:productos')) || []
      await kv.set('luli:productos', productos.filter(p => p.id !== id))
      return res.status(200).json({ ok: true })
    }

    if (type === 'producto-disponibilidad') {
      const productos = (await kv.get('luli:productos')) || []
      const idx = productos.findIndex(p => p.id === id)
      if (idx >= 0) productos[idx].disponible = disponible
      await kv.set('luli:productos', productos)
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Tipo de operación desconocido.' })
  } catch (err) {
    console.error('update error:', err)
    return res.status(500).json({ error: 'Error interno.' })
  }
}
