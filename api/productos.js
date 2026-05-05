const { Redis } = require('@upstash/redis')
const kv = new Redis({ url: process.env.kv_KV_REST_API_URL, token: process.env.kv_KV_REST_API_TOKEN })

const SEED_PRODUCTOS = [
  {
    id: 'chulo-mariposa-rosa-001',
    nombre: 'Chulo Mariposa Rosa',
    descripcion: 'Chulo artesanal con forma de mariposa. Tela suave, colores pastel — ideal para el día a día.',
    precio: 10000,
    categoria: 'ganchitos',
    disponible: true,
    foto: null,
    variantes: ['Rosa', 'Lila', 'Blanco']
  },
  {
    id: 'chulo-lazo-satin-001',
    nombre: 'Chulo Lazo Satín',
    descripcion: 'Elegante chulo con lazo en tela satinada. Perfecto para el colegio o el trabajo.',
    precio: 10000,
    categoria: 'ganchitos',
    disponible: true,
    foto: null,
    variantes: ['Negro', 'Blanco', 'Rojo', 'Azul']
  },
  {
    id: 'chulo-flor-encaje-001',
    nombre: 'Chulo Flor Encaje',
    descripcion: 'Chulo decorado con flor de encaje artesanal. Delicado, femenino y único.',
    precio: 10000,
    categoria: 'ganchitos',
    disponible: true,
    foto: null,
    variantes: ['Blanco', 'Beige', 'Rosa']
  },
  {
    id: 'funda-satin-rosada-001',
    nombre: 'Funda Satín Rosada',
    descripcion: 'Funda en tela satinada, suave con el cabello. Reduce el frizz mientras duermes.',
    precio: 20000,
    categoria: 'cintas',
    disponible: true,
    foto: null,
    variantes: ['Rosa', 'Nude', 'Lila']
  },
  {
    id: 'funda-terciopelo-001',
    nombre: 'Funda Terciopelo',
    descripcion: 'Funda en terciopelo suave. Estilo otoño-invierno, perfecta para cualquier ocasión.',
    precio: 20000,
    categoria: 'cintas',
    disponible: true,
    foto: null,
    variantes: ['Café', 'Vino', 'Verde Oliva']
  },
  {
    id: 'gorro-bano-floral-001',
    nombre: 'Gorro de Baño Floral',
    descripcion: 'Gorro de baño resistente al agua con estampado floral vibrante. Elástico ajustable.',
    precio: 20000,
    categoria: 'accesorios-especiales',
    disponible: true,
    foto: null,
    variantes: ['Multicolor']
  },
  {
    id: 'gorro-bano-clasico-001',
    nombre: 'Gorro de Baño Clásico',
    descripcion: 'Gorro de baño en PVC, duradero y práctico. Talla única con ribete de colores.',
    precio: 20000,
    categoria: 'accesorios-especiales',
    disponible: true,
    foto: null,
    variantes: ['Rosa', 'Azul', 'Blanco']
  }
]

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    let productos = await kv.get('luli:productos')
    if (!productos) {
      await kv.set('luli:productos', SEED_PRODUCTOS)
      productos = SEED_PRODUCTOS
    }
    return res.status(200).json(productos)
  } catch (err) {
    console.error('productos GET error:', err)
    return res.status(500).json({ error: 'Error al obtener productos.' })
  }
}
