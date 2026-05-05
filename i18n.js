const TRANSLATIONS = {
  es: {
    'carrito':               'Carrito',
    'hero.subtitulo':        'Para mujeres que cuidan cómo se ven — sin complicaciones.',
    'filtro.todos':          'Todos',
    'filtro.ganchitos':      'Ganchitos',
    'filtro.vinchas':        'Vinchas',
    'filtro.cintas':         'Cintas',
    'filtro.hebillas':       'Hebillas',
    'filtro.sets':           'Sets',
    'filtro.especiales':     'Especiales',
    'no.productos':          'No hay productos en esta categoría por ahora.',
    'error.productos':       'Error al cargar productos. Intentá más tarde.',
    'ciclovia.titulo':       '¡Nos vemos en la Ciclovía!',
    'ciclovia.desc':         'Cada domingo en el Parque de El Poblado, Medellín.<br>Ven a conocer nuestros productos en persona, probarlos y llevártelos al instante.',
    'footer.pagos':          'Pagos por Nequi · Envíos por Servientrega',
    'carrito.titulo':        'Mi pedido',
    'carrito.vacio':         'Tu carrito está vacío',
    'carrito.total':         'Total',
    'carrito.nequi':         'Paga por Nequi',
    'carrito.checkout':      'Hacer pedido por WhatsApp',
    'producto.agregar':      'Agregar al carrito',
    'producto.sin.stock':    'Sin stock',
    'producto.variante':     'Color / Variante',
    'toast.agregado':        'agregado al carrito',
  },
  en: {
    'carrito':               'Cart',
    'hero.subtitulo':        'For women who care about how they look — effortlessly.',
    'filtro.todos':          'All',
    'filtro.ganchitos':      'Hair Clips',
    'filtro.vinchas':        'Headbands',
    'filtro.cintas':         'Hair Ties',
    'filtro.hebillas':       'Barrettes',
    'filtro.sets':           'Sets',
    'filtro.especiales':     'Specials',
    'no.productos':          'No products in this category right now.',
    'error.productos':       'Error loading products. Please try again later.',
    'ciclovia.titulo':       'See you at the Ciclovía!',
    'ciclovia.desc':         'Every Sunday at Parque de El Poblado, Medellín.<br>Come see our products in person, try them on, and take them home.',
    'footer.pagos':          'Pay with Nequi · Shipping by Servientrega',
    'carrito.titulo':        'My Order',
    'carrito.vacio':         'Your cart is empty',
    'carrito.total':         'Total',
    'carrito.nequi':         'Pay with Nequi',
    'carrito.checkout':      'Order via WhatsApp',
    'producto.agregar':      'Add to cart',
    'producto.sin.stock':    'Out of stock',
    'producto.variante':     'Color / Variant',
    'toast.agregado':        'added to cart',
  }
}

const COLOR_MAP = {
  'Rosa': 'Pink',
  'Lila': 'Lilac',
  'Blanco': 'White',
  'Negro': 'Black',
  'Rojo': 'Red',
  'Azul': 'Blue',
  'Beige': 'Beige',
  'Café': 'Brown',
  'Vino': 'Wine',
  'Verde Oliva': 'Olive Green',
  'Multicolor': 'Multicolor',
  'Nude': 'Nude',
  'Azul Cielo': 'Sky Blue',
  'Dorado': 'Gold',
  'Plateado': 'Silver',
  'Naranja': 'Orange',
  'Amarillo': 'Yellow',
  'Verde': 'Green',
  'Morado': 'Purple',
  'Gris': 'Gray',
}

let currentLang = localStorage.getItem('luli_lang') || 'es'

function tColor(name) {
  if (currentLang === 'es') return name
  return COLOR_MAP[name] || name
}

function t(key) {
  return (TRANSLATIONS[currentLang] || TRANSLATIONS.es)[key] || TRANSLATIONS.es[key] || key
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n)
  })
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml)
  })
  const btn = document.getElementById('btnLang')
  if (btn) btn.textContent = currentLang === 'es' ? 'EN' : 'ES'
  document.documentElement.lang = currentLang
}

function setLang(lang) {
  currentLang = lang
  localStorage.setItem('luli_lang', lang)
  applyTranslations()
  if (typeof renderProductos === 'function') renderProductos()
  if (typeof renderCarrito === 'function') renderCarrito()
}

document.addEventListener('DOMContentLoaded', applyTranslations)
