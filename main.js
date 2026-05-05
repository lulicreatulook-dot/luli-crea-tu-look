// main.js — catálogo, filtros, modal de producto
let todosLosProductos = []
let categoriaActual = ''
let productoEnModal = null
let varianteSeleccionada = ''

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
    document.getElementById('noProductos').textContent = 'Error al cargar productos. Intentá más tarde.'
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

    const accionHtml = p.disponible === false
      ? `<span class="badge-no-disponible">Sin stock</span>`
      : `<button class="btn-agregar" onclick="abrirModal('${p.id}')">Agregar al carrito</button>`

    return `
      <article class="producto-card ${p.disponible === false ? 'no-disponible' : ''}"
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
  varianteSeleccionada = productoEnModal.variantes?.[0] || ''

  const modal = document.getElementById('modalProducto')
  const overlay = document.getElementById('modalOverlay')
  if (!modal || !overlay) return

  const fotoHtml = productoEnModal.foto
    ? `<img class="modal-foto" src="${productoEnModal.foto}" alt="${productoEnModal.nombre}">`
    : `<div class="modal-foto-placeholder">${ICONO_PRODUCTO.replace('48', '72')}</div>`

  const variantesHtml = productoEnModal.variantes?.length
    ? `<p class="modal-variantes-label">Color / Variante</p>
       <div class="variantes-grid" id="variantesGrid">
         ${productoEnModal.variantes.map(v =>
           `<button class="variante-btn ${v === varianteSeleccionada ? 'seleccionada' : ''}"
                    onclick="seleccionarVariante('${v}')">${v}</button>`
         ).join('')}
       </div>`
    : ''

  const btnHtml = productoEnModal.disponible === false
    ? `<button class="modal-agregar" disabled>Sin stock</button>`
    : `<button class="modal-agregar" id="btnModalAgregar">Agregar al carrito</button>`

  modal.innerHTML = `
    <button class="modal-cerrar" onclick="cerrarModal()" aria-label="Cerrar">✕</button>
    ${fotoHtml}
    <div class="modal-body">
      <h2 class="modal-nombre">${productoEnModal.nombre}</h2>
      <p class="modal-precio">${formatPrecio(productoEnModal.precio)}</p>
      ${productoEnModal.descripcion ? `<p class="modal-descripcion">${productoEnModal.descripcion}</p>` : ''}
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
    btn.classList.toggle('seleccionada', btn.textContent === v)
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
