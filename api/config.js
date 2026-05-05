const { kv } = require('@vercel/kv')

const SEED_CONFIG = {
  whatsapp: '+573023264558',
  nequi_numero: '3023264558',
  nequi_qr_url: null,
  ciclovia_activa: false,
  cloudinary_cloud_name: '',
  cloudinary_upload_preset: ''
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    let config = await kv.get('luli:config')
    if (!config) {
      await kv.set('luli:config', SEED_CONFIG)
      config = SEED_CONFIG
    }
    return res.status(200).json(config)
  } catch (err) {
    console.error('config GET error:', err)
    return res.status(500).json({ error: 'Error al obtener configuración.' })
  }
}
