// Carrito — estado en localStorage, accesible globalmente
const CARRITO_KEY = 'luli_carrito'

let carritoAbierto = false
let configGlobal = {}

function getCarrito() {
  try { return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [] }
  catch { return [] }
}

function saveCarrito(items) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(items))
  actualizarContador()
}

function actualizarContador() {
  const count = getCarrito().reduce((s, i) => s + i.cantidad, 0)
  const el = document.getElementById('carritoCount')
  if (el) el.textContent = count
}

function agregarAlCarrito(producto, variante) {
  const items = getCarrito()
  const key = producto.id + '||' + (variante || '')
  const idx = items.findIndex(i => i._key === key)
  if (idx >= 0) {
    items[idx].cantidad++
  } else {
    items.push({
      _key: key,
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      foto: producto.foto || null,
      variante: variante || '',
      cantidad: 1
    })
  }
  saveCarrito(items)
  mostrarToast(`"${producto.nombre}" ${t('toast.agregado')}`)
  renderCarrito()
}

function cambiarCantidad(key, delta) {
  const items = getCarrito()
  const idx = items.findIndex(i => i._key === key)
  if (idx < 0) return
  items[idx].cantidad += delta
  if (items[idx].cantidad <= 0) items.splice(idx, 1)
  saveCarrito(items)
  renderCarrito()
}

function eliminarItem(key) {
  saveCarrito(getCarrito().filter(i => i._key !== key))
  renderCarrito()
}

function formatPrecio(n) {
  return '$' + Number(n).toLocaleString('es-CO')
}

function generarLinkWhatsapp() {
  const items = getCarrito()
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const numero = (configGlobal.whatsapp || '+573023264558').replace(/\D/g, '')

  const lineas = items.map(i => {
    const v = i.variante ? ` (${i.variante})` : ''
    return `• ${i.nombre}${v} × ${i.cantidad} — ${formatPrecio(i.precio * i.cantidad)}`
  }).join('\n')

  const mensaje =
    `¡Hola! Me gustaría hacer el siguiente pedido de *Luli Crea Tu Look*:\n\n` +
    `🛍️ *Mi pedido:*\n${lineas}\n\n` +
    `💰 *Total: ${formatPrecio(total)}*\n\n¡Gracias!`

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}

function renderCarrito() {
  const items = getCarrito()
  const contenedor = document.getElementById('carritoItems')
  const footer = document.getElementById('carritoFooter')
  if (!contenedor || !footer) return

  if (items.length === 0) {
    contenedor.innerHTML = `
      <div class="carrito-vacio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>${t('carrito.vacio')}</p>
      </div>`
    footer.innerHTML = ''
    return
  }

  contenedor.innerHTML = items.map(item => {
    const fotoHtml = item.foto
      ? `<img class="carrito-item-foto" src="${item.foto}" alt="${item.nombre}" loading="lazy">`
      : `<div class="carrito-item-foto" style="background:var(--oro-claro)"></div>`
    const varianteHtml = item.variante ? `<div class="carrito-item-variante">${item.variante}</div>` : ''
    return `
      <div class="carrito-item">
        ${fotoHtml}
        <div class="carrito-item-info">
          <div class="carrito-item-nombre">${item.nombre}</div>
          ${varianteHtml}
          <div class="carrito-item-controles">
            <button class="btn-qty" onclick="cambiarCantidad('${item._key}', -1)" aria-label="Menos">−</button>
            <span class="qty-num">${item.cantidad}</span>
            <button class="btn-qty" onclick="cambiarCantidad('${item._key}', 1)" aria-label="Más">+</button>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px">
          <span class="carrito-item-precio">${formatPrecio(item.precio * item.cantidad)}</span>
          <button class="btn-eliminar" onclick="eliminarItem('${item._key}')" aria-label="Eliminar">✕</button>
        </div>
      </div>`
  }).join('')

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0)

  let nequiHtml = ''
  if (configGlobal.nequi_qr_url || configGlobal.nequi_numero) {
    const qrHtml = configGlobal.nequi_qr_url
      ? `<img src="${configGlobal.nequi_qr_url}" alt="QR Nequi" style="max-width:120px; border-radius:4px; display:block; margin:0 auto 4px">`
      : ''
    const numHtml = configGlobal.nequi_numero
      ? `<p class="nequi-numero">${configGlobal.nequi_numero}</p>`
      : ''
    nequiHtml = `
      <div class="nequi-qr">
        <p>${t('carrito.nequi')}</p>
        ${qrHtml}
        ${numHtml}
      </div>`
  }

  footer.innerHTML = `
    <div class="carrito-total">
      <span>${t('carrito.total')}</span>
      <span class="total-monto">${formatPrecio(total)}</span>
    </div>
    ${nequiHtml}
    <a class="btn-checkout" href="${generarLinkWhatsapp()}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      ${t('carrito.checkout')}
    </a>`
}

function abrirCarrito() {
  carritoAbierto = true
  document.getElementById('carritoSidebar')?.classList.add('activo')
  document.getElementById('carritoOverlay')?.classList.add('activo')
  document.body.style.overflow = 'hidden'
  renderCarrito()
}

function cerrarCarrito() {
  carritoAbierto = false
  document.getElementById('carritoSidebar')?.classList.remove('activo')
  document.getElementById('carritoOverlay')?.classList.remove('activo')
  document.body.style.overflow = ''
}

let toastTimer = null
function mostrarToast(msg) {
  const el = document.getElementById('toast')
  if (!el) return
  el.textContent = msg
  el.classList.add('visible')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.classList.remove('visible'), 2500)
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarContador()
  document.getElementById('btnCarrito')?.addEventListener('click', abrirCarrito)
  document.getElementById('btnCerrarCarrito')?.addEventListener('click', cerrarCarrito)
  document.getElementById('carritoOverlay')?.addEventListener('click', cerrarCarrito)
})
