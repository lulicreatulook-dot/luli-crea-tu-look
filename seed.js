// seed.js — carga el inventario real de Luli Crea Tu Look a Redis
// Uso: node seed.js
// Prerequisito: vercel env pull .env.local  (en Git Bash o terminal con Vercel CLI)

const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) {
      const key = line.slice(0, eq).trim()
      const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      if (key) process.env[key] = val
    }
  }
}

const { Redis } = require('@upstash/redis')
const kv = new Redis({ url: process.env.kv_KV_REST_API_URL, token: process.env.kv_KV_REST_API_TOKEN })

const v = (nombre, stock) => ({ nombre, stock })

// Productos con precio pendiente de confirmar con Libia → precio: 1, disponible: false
const PRODUCTOS = [

  // ── SCRUNCHIES ────────────────────────────────────────────────────────────

  {
    id: 'donita-satin-mini',
    nombre: 'Donita Satín Mini',
    descripcion: 'Pequeñita pero poderosa. Esta donita en satín cuida tu cabello sin dejarte marca ni romperte el pelo. Perfecta para cualquier momento del día, desde recogerte en casa hasta salir con estilo.',
    descripcion_en: 'Small but mighty. This mini satin scrunchie holds your hair gently without leaving creases or breakage. Perfect for everyday wear — from a quick bun at home to a polished look on the go.',
    precio: 2000,
    categoria: 'scrunchies',
    disponible: true,
    foto: null,
    variantes: [
      v('Negro', 36), v('Morado', 8), v('Palo de rosa', 6), v('Rosado salmón', 6),
      v('Agua marina', 4), v('Brillante rosado', 3), v('Morado brillante', 3),
      v('Metalizado rosado', 2), v('Gris claro', 2), v('Brillante salmón', 2),
      v('Brillante fucsia', 2), v('Gris oscuro', 1), v('Rojo', 1), v('Beige', 1),
      v('Verde oliva', 1), v('Amarillo', 1), v('Verde', 1), v('Dorado', 1),
    ],
  },

  {
    id: 'dona-clasica-satin',
    nombre: 'Dona Clásica Satín',
    descripcion: 'La que nunca falla. Blanca o negra, esta dona mediana en satín suave es el básico que toda mujer necesita. No jala, no rompe, y sirve para todo el día. También disponible en combo: 2 × $5.000.',
    descripcion_en: 'The one that never lets you down. White or black, this medium satin scrunchie is the everyday essential every woman needs. No pulling, no breakage — all day wear. Also available as a 2-pack for $5,000.',
    precio: 3000,
    categoria: 'scrunchies',
    disponible: true,
    foto: null,
    variantes: [
      v('Negro', 38), v('Blanco', 31), v('Rosado', 3), v('Rojo', 3), v('Amarillo', 3),
      v('Palo de rosa', 2), v('Beige', 2), v('Morado', 2), v('Azul oscuro', 2),
      v('Dorado', 1), v('Morado brillante', 1), v('Azul cielo', 1), v('Morado oscuro', 1),
      v('Rosa', 1), v('Rosa brillante', 1), v('Verde', 1), v('Blanco brillante', 1),
    ],
  },

  {
    id: 'dona-color-satin',
    nombre: 'Dona Color Satín',
    descripcion: '¿Por qué conformarse con uno solo cuando puedes combinar con todo? Esta dona mediana en satín viene en los colores más lindos para que tu recogido siempre haga parte del look.',
    descripcion_en: 'Why settle for plain when you can match everything? This medium satin scrunchie comes in beautiful shades so your hair accessory is always part of the outfit.',
    precio: 2000,
    categoria: 'scrunchies',
    disponible: true,
    foto: null,
    variantes: [
      v('Rosado brillante (varios tonos)', 10), v('Rojo pasión', 10), v('Negro', 8),
      v('Azul brillante', 8), v('Beige', 7), v('Rosado pastel', 7), v('Amarillo', 7),
      v('Morado tono medio brillante', 6), v('Azul', 6), v('Gris brillante oscuro', 6),
      v('Vinotinto', 5), v('Verde esmeralda', 5), v('Gris claro', 4),
      v('Morado brillante', 3), v('Verde brillante', 3), v('Dorado', 3),
      v('Café', 2), v('Rosadito brillante', 1), v('Café brillante dorado', 1),
      v('Azul brillante extra', 1),
    ],
  },

  {
    id: 'gran-dona-seda',
    nombre: 'Gran Dona de Seda',
    descripcion: 'Para las que lo quieren todo grande y con clase. Esta dona de seda premium es suave, elegante y protege tu cabello mientras lo mantiene recogido con estilo. Un lujo pequeño para el día a día.',
    descripcion_en: 'For those who love a bold, elegant look. This premium silk scrunchie is soft, luxurious, and keeps your hair protected while looking effortlessly chic every single day.',
    precio: 5000,
    categoria: 'scrunchies',
    disponible: true,
    foto: null,
    variantes: [
      v('Gris brillante', 1), v('Beige', 1), v('Rosado', 1), v('Café', 1), v('Crema', 1),
    ],
  },

  {
    id: 'dona-neon-brillante',
    nombre: 'Dona Neón Brillante',
    descripcion: '¡Para las que no pasan desapercibidas! Esta dona neón en satín fosforescente le da vida a cualquier look. Vibrante, divertida y sin maltrato para tu cabello.',
    descripcion_en: 'For the ones who love to stand out! This neon satin scrunchie brings bold color to any look. Vibrant, fun, and still completely gentle on your hair.',
    precio: 5000,
    categoria: 'scrunchies',
    disponible: true,
    foto: null,
    variantes: [
      v('Verde neón', 3), v('Naranjado neón', 3), v('Amarillo neón', 3),
    ],
  },

  // ── GORRITOS ADULTO ───────────────────────────────────────────────────────

  {
    id: 'gorrito-satin-elastico',
    nombre: 'Gorrito Satín con Elástico',
    descripcion: 'Duerme tranquila sabiendo que tu cabello va a amanecer como lo dejaste. Este gorrito en satín con elástico suave protege tus rizos, ondas o alisado toda la noche sin apretarte la cabeza.',
    descripcion_en: 'Wake up to hair that looks just as good as when you went to sleep. This soft elastic satin bonnet protects your curls, waves, or straightened hair all night without squeezing your head.',
    precio: 9000,
    categoria: 'gorritos-adulto',
    disponible: true,
    foto: null,
    variantes: [
      v('Negro', 5), v('Azul rey brillante', 2), v('Azul oscuro brillante', 2),
      v('Verde esmeralda brillante', 2), v('Verde navidad brillante', 2),
      v('Verde brillante', 2), v('Morado brillante', 2), v('Vino tinto', 2),
      v('Negro brillante', 1), v('Azul rey', 1), v('Azul brillante', 1),
      v('Morado', 1), v('Rosado brillante', 1), v('Rosado claro', 1),
      v('Rosado oscuro', 1), v('Salmón', 1), v('Salmón brillante', 1),
      v('Dorado', 1), v('Amarillo brillante', 1),
    ],
  },

  {
    id: 'gorrito-satin-banda',
    nombre: 'Gorrito Satín con Banda',
    descripcion: 'El favorito de las que se mueven mucho durmiendo. Este gorrito con banda ajustable no se cae en la noche y protege hasta los cabellos más largos o con más volumen. Suave, firme y cómodo.',
    descripcion_en: 'The favorite for those who toss and turn. This adjustable band bonnet stays put all night and protects even the longest or fullest hair. Soft, secure, and comfortable.',
    precio: 9000,
    categoria: 'gorritos-adulto',
    disponible: true,
    foto: null,
    variantes: [
      v('Negro', 5), v('Beige', 5), v('Azul cielo', 4), v('Azul rey', 3),
      v('Salmón', 3), v('Fucsia', 3), v('Dorado', 3), v('Azul metalizado oscuro', 2),
      v('Verde metalizado', 2), v('Vino tinto', 2), v('Cafés brillantes', 2),
      v('Morado brillante', 2), v('Café', 2), v('Gris', 2), v('Verde esmeralda', 2),
      v('Azul rey brillante', 1), v('Azul brillante encendido', 1), v('Morado claro', 1),
      v('Azul oscuro metalizado', 1), v('Rosado metalizado', 1), v('Azul claro brillante', 1),
      v('Azul oscuro brillante', 1), v('Beige brillante', 1), v('Rojo', 1),
      v('Salmón brillante', 1),
    ],
  },

  {
    id: 'mini-gorrito-satin',
    nombre: 'Mini Gorrito Satín',
    descripcion: 'El tamaño justo para quienes prefieren algo más ligero. Este mini gorrito en satín cuida tu cabello en la noche sin sentir que llevas nada puesto. Ideal para cabellos cortos o medianos.',
    descripcion_en: 'The right size for those who prefer something lighter. This mini satin bonnet protects your hair overnight without feeling bulky. Ideal for short to medium-length hair.',
    precio: 2000,
    categoria: 'gorritos-adulto',
    disponible: true,
    foto: null,
    variantes: [
      v('Rosadito varios tonos', 12), v('Morado pastel', 8), v('Gris brillante', 8),
      v('Azul brillante', 8), v('Morado oscuro', 6), v('Morado claro', 6), v('Beige', 6),
      v('Negro', 5), v('Café con visos dorados', 5), v('Cobre claro', 5),
      v('Rosado salmón', 4), v('Rojo brillante', 2), v('Azul cielo brillante', 2),
      v('Rosado brillante', 2), v('Café oscuro visos dorados', 2),
      v('Verde esmeralda brillante', 2), v('Verde limón brillante', 1),
      v('Blanco brillante', 1), v('Dorado', 1),
    ],
  },

  // ── GORRITOS NIÑOS ────────────────────────────────────────────────────────

  {
    id: 'gorrito-infantil-satin',
    nombre: 'Gorrito Infantil Satín',
    descripcion: 'Para que los peques también cuiden su cabello desde pequeños. Diseñado especialmente para niños y niñas, este gorrito en satín suave protege sus rulos o peinados mientras duermen. ¡Con estampados que les van a encantar!',
    descripcion_en: 'Because little ones deserve hair protection too. Specially designed for kids, this soft satin bonnet keeps their curls or styles intact while they sleep — with fun prints they\'ll absolutely love!',
    precio: 15000,
    categoria: 'gorritos-ninos',
    disponible: true,
    foto: null,
    variantes: [
      v('Niño — Dinosaurios negro', 2),
      v('Niño — Dinosaurios verde', 1),
      v('Niña liso — Rosado claro brillante', 2),
      v('Niña liso — Rosado oscuro brillante', 2),
      v('Niña liso — Beige brillante', 1),
      v('Niña — Unicornio rosado', 2),
      v('Niña — Unicornio morado', 2),
      v('Niña — Unicornio verde', 1),
      v('Niña — Unicornio gris/azul', 1),
      v('Niña tiritas — Azul claro brillante', 2),
      v('Niña tiritas — Rosado brillante', 1),
      v('Niña tiritas — Morado brillante', 1),
    ],
  },

  // ── GORROS GRANDES ────────────────────────────────────────────────────────

  {
    id: 'turbante-doble-faz-elastico',
    nombre: 'Turbante Doble Faz con Elástico',
    descripcion: 'Dos colores, un solo accesorio. Este turbante reversible con elástico cómodo es perfecto para proteger tu cabello en casa o para salir con estilo sin esfuerzo. Cámbiale la cara según tu humor.',
    descripcion_en: 'Two colors, one accessory. This reversible elastic turban is perfect for protecting your hair at home or stepping out in effortless style. Flip it to match your mood.',
    precio: 18000,
    categoria: 'gorros-grandes',
    disponible: true,
    foto: null,
    variantes: [
      v('Gris + Negro', 2),
      v('Gris + Verde', 1),
    ],
  },

  {
    id: 'turbante-reversible-libre',
    nombre: 'Turbante Reversible Libre',
    descripcion: 'Para las que prefieren sin ajuste. Este turbante doble faz sin elástico se acomoda a tu manera y combina dos colores en uno. Cómodo, versátil y perfecto para cualquier momento.',
    descripcion_en: 'For those who prefer a free fit. This double-sided turban without elastic adjusts however you like it, with two colors in one. Comfortable, versatile, and perfect for any occasion.',
    precio: 1,
    categoria: 'gorros-grandes',
    disponible: false,
    foto: null,
    variantes: [
      v('Rosado + Negro', 1),
      v('Rosado claro + Rosado oscuro', 1),
    ],
  },

  {
    id: 'gorro-largo-satin-moto',
    nombre: 'Gorro Largo Satín Moto',
    descripcion: 'Para las movileras y para las que tienen mucho cabello. Este gorro largo en satín con estampado animal print protege hasta el cabello más abundante y cabe perfecto debajo del casco. Sin aprietes, sin maltratos.',
    descripcion_en: 'For the riders and the ones with lots of hair. This long animal print satin cap protects even the fullest mane and fits perfectly under a helmet. No tightness, no damage.',
    precio: 18000,
    categoria: 'gorros-grandes',
    disponible: true,
    foto: null,
    variantes: [
      v('Animal print', 1),
    ],
  },

  {
    id: 'gorro-premium-seda',
    nombre: 'Gorro Premium de Seda',
    descripcion: 'El básico de noche que toda colección necesita. Este gorro de seda cuida tu cabello mientras duermes, previene el frizz y mantiene tu hidratación. Simple, elegante y efectivo.',
    descripcion_en: 'The nighttime essential every routine needs. This silk cap protects your hair while you sleep, prevents frizz, and locks in moisture. Simple, elegant, and effective.',
    precio: 1,
    categoria: 'gorros-grandes',
    disponible: false,
    foto: null,
    variantes: [
      v('Vino tinto', 4), v('Negro', 2), v('Rojo', 1), v('Rosado', 1), v('Dorado', 1),
    ],
  },

  {
    id: 'gorro-satin-estampado',
    nombre: 'Gorro Satín Estampado',
    descripcion: 'Porque proteger el cabello también puede ser divertido. Estos gorros en satín con estampados únicos son para las que quieren personalidad hasta en la noche. Cada diseño es limitado, ¡pídelo antes de que se acabe!',
    descripcion_en: 'Because protecting your hair can also be fun. These satin bonnets with unique prints are for those who want personality even at bedtime. Each design is limited — get yours before it\'s gone!',
    precio: 1,
    categoria: 'gorros-grandes',
    disponible: false,
    foto: null,
    variantes: [],
    stock: null,
  },

  // ── FUNDAS DE ALMOHADA ────────────────────────────────────────────────────

  {
    id: 'funda-satin-50x70',
    nombre: 'Funda Satín para Cabello 50×70',
    descripcion: 'Duerme sobre satín y despierta con el cabello como si acabaras de salir de la peluquería. Esta funda 50×70 cm reduce el frizz, previene quiebres y es suave con tu piel. El secreto mejor guardado del cuidado capilar.',
    descripcion_en: 'Sleep on satin and wake up with hair that looks like you just left the salon. This 50×70 cm pillowcase reduces frizz, prevents breakage, and is gentle on your skin. The best-kept secret in hair care.',
    precio: 16000,
    categoria: 'fundas',
    disponible: true,
    foto: null,
    variantes: [
      v('Negro', 1), v('Blanco', 1), v('Salmón', 1), v('Azul oscuro', 1),
    ],
  },

  {
    id: 'funda-satin-50x75',
    nombre: 'Funda Satín para Cabello 50×75',
    descripcion: 'Duerme sobre satín y despierta con el cabello como si acabaras de salir de la peluquería. Esta funda 50×75 cm reduce el frizz, previene quiebres y es suave con tu piel.',
    descripcion_en: 'Sleep on satin and wake up with hair that looks like you just left the salon. This 50×75 cm pillowcase reduces frizz, prevents breakage, and is gentle on your skin.',
    precio: 18000,
    categoria: 'fundas',
    disponible: false,
    foto: null,
    variantes: [],
    stock: null,
  },

  {
    id: 'funda-satin-55x85',
    nombre: 'Funda Satín para Cabello 55×85',
    descripcion: 'Duerme sobre satín y despierta con el cabello como si acabaras de salir de la peluquería. Esta funda 55×85 cm reduce el frizz, previene quiebres y es suave con tu piel.',
    descripcion_en: 'Sleep on satin and wake up with hair that looks like you just left the salon. This 55×85 cm pillowcase reduces frizz, prevents breakage, and is gentle on your skin.',
    precio: 20000,
    categoria: 'fundas',
    disponible: false,
    foto: null,
    variantes: [],
    stock: null,
  },

  // ── ACCESORIOS ────────────────────────────────────────────────────────────

  {
    id: 'hebilla-elegante',
    nombre: 'Hebilla Elegante',
    descripcion: 'El detalle que transforma cualquier peinado. Estas hebillas en dorado y plateado, disponibles en tamaño pequeño y mediano, le dan ese toque de clase a tu look sin esfuerzo. Unas son plásticas con brillo, otras en metal.',
    descripcion_en: 'The detail that elevates any hairstyle. These gold and silver hair clips, available in small and medium, add instant elegance to your look. Choose between shiny plastic or metal finish.',
    precio: 1,
    categoria: 'accesorios',
    disponible: false,
    foto: null,
    variantes: [
      v('Pequeña dorada', 0), v('Pequeña plateada', 0),
      v('Mediana dorada', 0), v('Mediana plateada', 0),
    ],
  },

  {
    id: 'toalla-microfibra',
    nombre: 'Toalla Microfibra para Cabello',
    descripcion: 'Dile adiós al frizz desde el baño. Esta toalla de microfibra absorbe el agua rapidísimo sin maltratar tu cabello ni tus rizos. Más suave, más rápida y más inteligente que la toalla de siempre.',
    descripcion_en: 'Say goodbye to frizz from the very start. This microfiber hair towel absorbs water fast without roughing up your hair or curls. Softer, faster, and smarter than your regular towel.',
    precio: 1,
    categoria: 'accesorios',
    disponible: false,
    foto: null,
    variantes: [
      v('Pequeña', 0), v('Grande', 0),
    ],
  },
]

async function seed() {
  if (!process.env.kv_KV_REST_API_URL || !process.env.kv_KV_REST_API_TOKEN) {
    console.error('Error: faltan las variables de entorno kv_KV_REST_API_URL y kv_KV_REST_API_TOKEN')
    console.error('Corré: vercel env pull .env.local')
    process.exit(1)
  }

  console.log(`Subiendo ${PRODUCTOS.length} productos a Redis...`)
  await kv.set('luli:productos', PRODUCTOS)
  console.log('Listo. Productos cargados exitosamente.')
  console.log()
  console.log('Resumen:')
  for (const p of PRODUCTOS) {
    const disp = p.disponible ? 'visible' : '⚠️  oculto'
    const vars = p.variantes?.length ? `${p.variantes.length} variantes` : 'sin variantes'
    console.log(`  ${disp}  ${p.nombre} (${p.categoria}) — ${vars}`)
  }
}

seed().catch(err => { console.error(err); process.exit(1) })
