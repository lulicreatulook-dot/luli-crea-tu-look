// main.js — catálogo, filtros, modal de producto
let todosLosProductos = []
let categoriaActual = ''
let productoEnModal = null
let varianteSeleccionada = ''

function normalizarVariantes(variantes) {
  if (!variantes?.length) return []
  return variantes.map(v => typeof v === 'string' ? { nombre: v, stock: 0 } : v)
}

function estaDisponible(p) {
  if (p.disponible === false) return false
  const variantes = normalizarVariantes(p.variantes)
  if (variantes.length > 0) return variantes.some(v => v.stock > 0)
  if (typeof p.stock === 'number') return p.stock > 0
  return true
}

const ICONO_PRODUCTO = `
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#C9A227" stroke-width="1.5" opacity="0.35">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </svg>`

async function cargarDatos() {
  try {
    const [productosRes, configRes] = await Promise.all([
      fetch('/api/productos'),
      fetch('/api/config')
    ])
    todosLosProductos = await productosRes.json()
    const config = await configRes.json()
    Object.assign(configGlobal, config)

    const fab = document.getElementById('fabWhatsapp')
    if (fab && config.whatsapp) {
      fab.href = `https://wa.me/${config.whatsapp.replace(/\D/g, '')}`
    }

    const ciclovia = document.getElementById('seccionCiclovia')
    if (ciclovia) {
      ciclovia.style.display = config.ciclovia_activa ? 'block' : 'none'
      ciclovia.setAttribute('aria-hidden', config.ciclovia_activa ? 'false' : 'true')
    }

    renderProductos()
  } catch (err) {
    console.error('Error cargando datos:', err)
    document.getElementById('loading').style.display = 'none'
    document.getElementById('noProductos').style.display = 'block'
    document.getElementById('noProductos').textContent = t('error.productos')
  }
}

function filtrar(productos) {
  if (!categoriaActual) return productos.filter(p => p.disponible !== false || true)
  return productos.filter(p => p.categoria === categoriaActual)
}

function renderProductos() {
  const grid = document.getElementById('productosGrid')
  const loading = document.getElementById('loading')
  const noProductos = document.getElementById('noProductos')
  if (!grid) return

  const lista = filtrar(todosLosProductos)

  loading.style.display = 'none'
  grid.style.display = ''
  noProductos.style.display = lista.length === 0 ? 'block' : 'none'

  grid.innerHTML = lista.map(p => {
    const fotoHtml = p.foto
      ? `<img class="producto-foto" src="${p.foto}" alt="${p.nombre}" loading="lazy">`
      : `<div class="producto-foto-placeholder">${ICONO_PRODUCTO}</div>`

    const accionHtml = !estaDisponible(p)
      ? `<span class="badge-no-disponible">${t('producto.sin.stock')}</span>`
      : `<button class="btn-agregar" onclick="abrirModal('${p.id}')">${t('producto.agregar')}</button>`

    return `
      <article class="producto-card ${!estaDisponible(p) ? 'no-disponible' : ''}"
               onclick="abrirModal('${p.id}')"
               aria-label="${p.nombre}, ${formatPrecio(p.precio)}">
        ${fotoHtml}
        <div class="producto-body">
          <h2 class="producto-nombre">${p.nombre}</h2>
          <p class="producto-precio">${formatPrecio(p.precio)}</p>
          ${accionHtml}
        </div>
      </article>`
  }).join('')
}

function abrirModal(id) {
  productoEnModal = todosLosProductos.find(p => p.id === id)
  if (!productoEnModal) return

  const variantes = normalizarVariantes(productoEnModal.variantes)
  varianteSeleccionada = variantes.find(v => v.stock > 0)?.nombre || variantes[0]?.nombre || ''

  const modal = document.getElementById('modalProducto')
  const overlay = document.getElementById('modalOverlay')
  if (!modal || !overlay) return

  const fotoHtml = productoEnModal.foto
    ? `<img class="modal-foto" src="${productoEnModal.foto}" alt="${productoEnModal.nombre}">`
    : `<div class="modal-foto-placeholder">${ICONO_PRODUCTO.replace('48', '72')}</div>`

  const variantesHtml = variantes.length
    ? `<p class="modal-variantes-label">${t('producto.variante')}</p>
       <div class="variantes-grid" id="variantesGrid">
         ${variantes.map(v =>
           `<button class="variante-btn ${v.nombre === varianteSeleccionada ? 'seleccionada' : ''} ${v.stock === 0 ? 'sin-stock' : ''}"
                    data-variante="${v.nombre}"
                    onclick="seleccionarVariante('${v.nombre}')"
                    ${v.stock === 0 ? 'disabled' : ''}>${tColor(v.nombre)}</button>`
         ).join('')}
       </div>`
    : ''

  const btnHtml = !estaDisponible(productoEnModal)
    ? `<button class="modal-agregar" disabled>${t('producto.sin.stock')}</button>`
    : `<button class="modal-agregar" id="btnModalAgregar">${t('producto.agregar')}</button>`

  modal.innerHTML = `
    <button class="modal-cerrar" onclick="cerrarModal()" aria-label="Cerrar">✕</button>
    ${fotoHtml}
    <div class="modal-body">
      <h2 class="modal-nombre">${productoEnModal.nombre}</h2>
      <p class="modal-precio">${formatPrecio(productoEnModal.precio)}</p>
      ${(() => {
        const desc = (currentLang === 'en' && productoEnModal.descripcion_en)
          ? productoEnModal.descripcion_en
          : productoEnModal.descripcion
        return desc ? `<p class="modal-descripcion">${desc}</p>` : ''
      })()}
      ${variantesHtml}
      ${btnHtml}
    </div>`

  document.getElementById('btnModalAgregar')?.addEventListener('click', () => {
    agregarAlCarrito(productoEnModal, varianteSeleccionada)
    cerrarModal()
    abrirCarrito()
  })

  overlay.classList.add('activo')
  modal.classList.add('activo')
  document.body.style.overflow = 'hidden'
}

function seleccionarVariante(v) {
  varianteSeleccionada = v
  document.querySelectorAll('.variante-btn').forEach(btn => {
    btn.classList.toggle('seleccionada', btn.dataset.variante === v)
  })
}

function cerrarModal() {
  document.getElementById('modalProducto')?.classList.remove('activo')
  document.getElementById('modalOverlay')?.classList.remove('activo')
  document.body.style.overflow = ''
  productoEnModal = null
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDatos()

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      categoriaActual = btn.dataset.cat
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'))
      btn.classList.add('activo')
      renderProductos()
    })
  })

  document.getElementById('modalOverlay')?.addEventListener('click', cerrarModal)

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (productoEnModal) cerrarModal()
      else if (carritoAbierto) cerrarCarrito()
    }
  })
})
