// admin.js — Panel de administración
const TOKEN_KEY = 'luli_token'
let configCache = null
let productosCache = []
let productoEditando = null

// ── Auth ──────────────────────────────────────────────────
function getToken() { return sessionStorage.getItem(TOKEN_KEY) }
function setToken(t) { sessionStorage.setItem(TOKEN_KEY, t) }
function clearToken() { sessionStorage.removeItem(TOKEN_KEY) }

function mostrarPanel() {
  document.getElementById('loginScreen').style.display = 'none'
  document.getElementById('adminPanel').style.display = 'block'
  cargarDatos()
}

function mostrarLogin() {
  document.getElementById('loginScreen').style.display = ''
  document.getElementById('adminPanel').style.display = 'none'
}

// ── API helper ────────────────────────────────────────────
async function apiPost(type, body) {
  const res = await fetch('/api/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ type, ...body })
  })
  if (res.status === 401) {
    clearToken()
    mostrarLogin()
    throw new Error('Sesión expirada.')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Error ${res.status}`)
  }
  return res.json()
}

// ── Carga inicial ─────────────────────────────────────────
async function cargarDatos() {
  await Promise.all([cargarProductos(), cargarConfig()])
}

async function cargarProductos() {
  const loading = document.getElementById('loadingProductos')
  const lista = document.getElementById('listaProductos')
  loading.style.display = 'flex'
  lista.style.display = 'none'
  try {
    const res = await fetch('/api/productos')
    productosCache = await res.json()
    renderListaProductos()
  } catch {
    lista.innerHTML = '<p style="color:var(--error);padding:16px">Error al cargar productos.</p>'
    lista.style.display = 'block'
  } finally {
    loading.style.display = 'none'
  }
}

async function cargarConfig() {
  const loading = document.getElementById('loadingConfig')
  const wrap = document.getElementById('formConfigWrap')
  loading.style.display = 'flex'
  wrap.style.display = 'none'
  try {
    const res = await fetch('/api/config')
    configCache = await res.json()
    poblarFormConfig()
    poblarCiclovia()
  } catch {
    // non-critical — user can retry via save
  } finally {
    loading.style.display = 'none'
    wrap.style.display = 'block'
  }
}

// ── Render lista productos ────────────────────────────────
function fmtPrecio(n) {
  return '$' + Number(n).toLocaleString('es-CO')
}

function renderListaProductos() {
  const lista = document.getElementById('listaProductos')
  lista.style.display = 'block'

  if (productosCache.length === 0) {
    lista.innerHTML = `<p style="color:var(--texto-suave);padding:24px;text-align:center">
      No hay productos todavía. Agregá el primero.
    </p>`
    return
  }

  lista.innerHTML = productosCache.map(p => {
    const fotoHtml = p.foto
      ? `<img class="producto-admin-foto" src="${p.foto}" alt="${p.nombre}">`
      : `<div class="producto-admin-foto" style="display:flex;align-items:center;justify-content:center">
           <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#C9A227" stroke-width="1.5" opacity="0.5">
             <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
             <polyline points="21,15 16,10 5,21"/>
           </svg>
         </div>`

    const disponible = p.disponible !== false
    const nuevoVal = disponible ? 'false' : 'true'

    return `
      <div class="producto-admin-card">
        ${fotoHtml}
        <div class="producto-admin-info">
          <div class="producto-admin-nombre">${p.nombre}</div>
          <div class="producto-admin-meta">${fmtPrecio(p.precio)} · ${p.categoria}</div>
          <div class="producto-admin-acciones">
            <span class="badge-disponible ${disponible ? 'si' : 'no'}">${disponible ? 'Disponible' : 'Sin stock'}</span>
            <button class="btn-secondary" style="font-size:0.8rem;padding:6px 12px"
                    onclick="abrirModalEditar('${p.id}')">Editar</button>
            <button class="btn-secondary" style="font-size:0.8rem;padding:6px 12px"
                    onclick="toggleDisponibilidad('${p.id}', ${nuevoVal})">${disponible ? 'Marcar sin stock' : 'Activar'}</button>
            <button class="btn-danger"
                    onclick="confirmarEliminar('${p.id}', '${p.nombre.replace(/'/g, "\\'")}')">Eliminar</button>
          </div>
        </div>
      </div>`
  }).join('')
}

// ── Toggle disponibilidad ─────────────────────────────────
async function toggleDisponibilidad(id, nuevoValor) {
  try {
    await apiPost('producto-disponibilidad', { id, disponible: nuevoValor })
    const idx = productosCache.findIndex(p => p.id === id)
    if (idx >= 0) productosCache[idx].disponible = nuevoValor
    renderListaProductos()
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

// ── Eliminar producto ─────────────────────────────────────
async function confirmarEliminar(id, nombre) {
  if (!confirm(`¿Eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) return
  try {
    await apiPost('producto-delete', { id })
    productosCache = productosCache.filter(p => p.id !== id)
    renderListaProductos()
  } catch (err) {
    alert('Error al eliminar: ' + err.message)
  }
}

// ── Modal producto ────────────────────────────────────────
const FOTO_PLACEHOLDER_SVG = `
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#C9A227" stroke-width="1.5" opacity="0.4">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </svg>`

function abrirModalNuevo() {
  productoEditando = null
  document.getElementById('modalTitulo').textContent = 'Nuevo producto'
  document.getElementById('prodNombre').value = ''
  document.getElementById('prodDescripcion').value = ''
  document.getElementById('prodPrecio').value = ''
  document.getElementById('prodCategoria').value = 'ganchitos'
  document.getElementById('prodVariantes').value = ''
  document.getElementById('prodDisponible').checked = true
  document.getElementById('prodFoto').value = ''
  document.getElementById('fotoPreviewWrap').innerHTML = FOTO_PLACEHOLDER_SVG
  document.getElementById('modalError').style.display = 'none'
  abrirModal()
}

function abrirModalEditar(id) {
  const p = productosCache.find(prod => prod.id === id)
  if (!p) return
  productoEditando = p

  document.getElementById('modalTitulo').textContent = 'Editar producto'
  document.getElementById('prodNombre').value = p.nombre || ''
  document.getElementById('prodDescripcion').value = p.descripcion || ''
  document.getElementById('prodPrecio').value = p.precio || ''
  document.getElementById('prodCategoria').value = p.categoria || 'ganchitos'
  document.getElementById('prodVariantes').value = (p.variantes || []).join(', ')
  document.getElementById('prodDisponible').checked = p.disponible !== false
  document.getElementById('prodFoto').value = p.foto || ''

  const preview = document.getElementById('fotoPreviewWrap')
  preview.innerHTML = p.foto
    ? `<img src="${p.foto}" alt="${p.nombre}" style="width:100%;height:100%;object-fit:cover">`
    : FOTO_PLACEHOLDER_SVG

  document.getElementById('modalError').style.display = 'none'
  abrirModal()
}

function abrirModal() {
  document.getElementById('modalOverlay').style.display = 'block'
  document.getElementById('modalProducto').style.display = 'block'
  document.body.style.overflow = 'hidden'
}

function cerrarModalProducto() {
  document.getElementById('modalOverlay').style.display = 'none'
  document.getElementById('modalProducto').style.display = 'none'
  document.body.style.overflow = ''
  productoEditando = null
}

async function guardarProducto() {
  const nombre = document.getElementById('prodNombre').value.trim()
  const precio = Number(document.getElementById('prodPrecio').value)
  const errorEl = document.getElementById('modalError')
  const btn = document.getElementById('btnGuardarProducto')

  if (!nombre) {
    errorEl.textContent = 'El nombre es obligatorio.'
    errorEl.style.display = 'block'
    return
  }
  if (!precio || precio <= 0) {
    errorEl.textContent = 'El precio debe ser mayor a 0.'
    errorEl.style.display = 'block'
    return
  }
  errorEl.style.display = 'none'

  const variantesRaw = document.getElementById('prodVariantes').value
  const variantes = variantesRaw
    ? variantesRaw.split(',').map(v => v.trim()).filter(Boolean)
    : []

  const producto = {
    id: productoEditando?.id || ('prod_' + Date.now()),
    nombre,
    descripcion: document.getElementById('prodDescripcion').value.trim(),
    precio,
    categoria: document.getElementById('prodCategoria').value,
    variantes,
    disponible: document.getElementById('prodDisponible').checked,
    foto: document.getElementById('prodFoto').value || null
  }

  btn.disabled = true
  btn.textContent = 'Guardando...'

  try {
    await apiPost('producto-update', { data: producto })
    const idx = productosCache.findIndex(p => p.id === producto.id)
    if (idx >= 0) productosCache[idx] = producto
    else productosCache.push(producto)
    renderListaProductos()
    cerrarModalProducto()
  } catch (err) {
    errorEl.textContent = 'Error al guardar: ' + err.message
    errorEl.style.display = 'block'
  } finally {
    btn.disabled = false
    btn.textContent = 'Guardar'
  }
}

// ── Cloudinary Upload Widget ──────────────────────────────
function abrirCloudinaryWidget(onSuccess) {
  const cloudName = configCache?.cloudinary_cloud_name
  const uploadPreset = configCache?.cloudinary_upload_preset

  if (!cloudName || !uploadPreset) {
    alert('Primero guardá el Cloud Name y Upload Preset de Cloudinary en la pestaña Configuración.')
    return
  }

  if (typeof cloudinary === 'undefined') {
    alert('El widget de Cloudinary no está disponible. Revisá la conexión a internet.')
    return
  }

  cloudinary.openUploadWidget(
    {
      cloudName,
      uploadPreset,
      sources: ['local', 'camera'],
      multiple: false,
      maxFileSize: 5000000,
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp']
    },
    (error, result) => {
      if (!error && result?.event === 'success') {
        onSuccess(result.info.secure_url)
      }
    }
  )
}

// ── Tab Ciclovía ──────────────────────────────────────────
function poblarCiclovia() {
  if (!configCache) return
  const toggle = document.getElementById('toggleCiclovia')
  toggle.checked = !!configCache.ciclovia_activa
  actualizarTextoCiclovia(toggle.checked)
}

function actualizarTextoCiclovia(activa) {
  document.getElementById('cicloviaEstado').textContent = activa
    ? 'Activa — visible en la tienda'
    : 'Inactiva — oculta en la tienda'
}

async function guardarCiclovia() {
  const activa = document.getElementById('toggleCiclovia').checked
  const msg = document.getElementById('cicloviaMsg')
  const btn = document.getElementById('btnGuardarCiclovia')

  btn.disabled = true
  try {
    await apiPost('config', { data: { ciclovia_activa: activa } })
    if (configCache) configCache.ciclovia_activa = activa
    actualizarTextoCiclovia(activa)
    msg.textContent = 'Guardado correctamente.'
    msg.className = 'msg-exito'
    msg.style.display = 'block'
    setTimeout(() => { msg.style.display = 'none' }, 3000)
  } catch (err) {
    msg.textContent = 'Error al guardar: ' + err.message
    msg.className = 'msg-error'
    msg.style.display = 'block'
  } finally {
    btn.disabled = false
  }
}

// ── Tab Config ────────────────────────────────────────────
function poblarFormConfig() {
  if (!configCache) return
  document.getElementById('cfgWhatsapp').value = configCache.whatsapp || ''
  document.getElementById('cfgNequiNumero').value = configCache.nequi_numero || ''
  document.getElementById('cfgNequiQr').value = configCache.nequi_qr_url || ''
  document.getElementById('cfgCloudinaryName').value = configCache.cloudinary_cloud_name || ''
  document.getElementById('cfgCloudinaryPreset').value = configCache.cloudinary_upload_preset || ''

  if (configCache.nequi_qr_url) {
    document.getElementById('nequiQrPreview').innerHTML =
      `<img src="${configCache.nequi_qr_url}" alt="QR Nequi">`
  }
}

async function guardarConfig(e) {
  e.preventDefault()
  const msg = document.getElementById('configMsg')
  const btn = e.target.querySelector('[type="submit"]')

  const data = {
    whatsapp: document.getElementById('cfgWhatsapp').value.trim(),
    nequi_numero: document.getElementById('cfgNequiNumero').value.trim(),
    nequi_qr_url: document.getElementById('cfgNequiQr').value.trim() || null,
    cloudinary_cloud_name: document.getElementById('cfgCloudinaryName').value.trim(),
    cloudinary_upload_preset: document.getElementById('cfgCloudinaryPreset').value.trim()
  }

  btn.disabled = true
  try {
    await apiPost('config', { data })
    Object.assign(configCache || {}, data)
    msg.textContent = 'Configuración guardada correctamente.'
    msg.className = 'msg-exito'
    msg.style.display = 'block'
    setTimeout(() => { msg.style.display = 'none' }, 3000)
  } catch (err) {
    msg.textContent = 'Error al guardar: ' + err.message
    msg.className = 'msg-error'
    msg.style.display = 'block'
  } finally {
    btn.disabled = false
  }
}

// ── Tabs ──────────────────────────────────────────────────
function cambiarTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const activo = btn.dataset.tab === tabName
    btn.classList.toggle('activo', activo)
    btn.setAttribute('aria-selected', activo ? 'true' : 'false')
  })
  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.style.display = panel.id === `tab-${tabName}` ? '' : 'none'
  })
}

// ── DOMContentLoaded ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  if (getToken()) mostrarPanel()

  // Login
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault()
    const password = document.getElementById('passwordInput').value
    const errorEl = document.getElementById('loginError')
    const btn = document.getElementById('btnLogin')

    btn.disabled = true
    errorEl.style.display = 'none'

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      if (res.ok) {
        const { token } = await res.json()
        setToken(token)
        mostrarPanel()
      } else {
        errorEl.textContent = 'Contraseña incorrecta.'
        errorEl.style.display = 'block'
        document.getElementById('passwordInput').value = ''
        document.getElementById('passwordInput').focus()
      }
    } catch {
      errorEl.textContent = 'Error de conexión. Intentá de nuevo.'
      errorEl.style.display = 'block'
    } finally {
      btn.disabled = false
    }
  })

  // Logout
  document.getElementById('btnLogout').addEventListener('click', () => {
    clearToken()
    mostrarLogin()
  })

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarTab(btn.dataset.tab))
  })

  // Nuevo producto
  document.getElementById('btnNuevoProducto').addEventListener('click', abrirModalNuevo)

  // Modal: guardar y cancelar
  document.getElementById('btnGuardarProducto').addEventListener('click', guardarProducto)
  document.getElementById('btnCancelarModal').addEventListener('click', cerrarModalProducto)
  document.getElementById('modalOverlay').addEventListener('click', cerrarModalProducto)

  // Subir foto de producto
  document.getElementById('btnSubirFoto').addEventListener('click', () => {
    abrirCloudinaryWidget(url => {
      document.getElementById('prodFoto').value = url
      document.getElementById('fotoPreviewWrap').innerHTML =
        `<img src="${url}" alt="Foto" style="width:100%;height:100%;object-fit:cover">`
    })
  })

  // Subir QR Nequi
  document.getElementById('btnSubirQR').addEventListener('click', () => {
    abrirCloudinaryWidget(url => {
      document.getElementById('cfgNequiQr').value = url
      document.getElementById('nequiQrPreview').innerHTML =
        `<img src="${url}" alt="QR Nequi">`
    })
  })

  // Ciclovía
  document.getElementById('btnGuardarCiclovia').addEventListener('click', guardarCiclovia)
  document.getElementById('toggleCiclovia').addEventListener('change', e => {
    actualizarTextoCiclovia(e.target.checked)
  })

  // Config general
  document.getElementById('formConfig').addEventListener('submit', guardarConfig)

  // Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModalProducto()
  })
})
