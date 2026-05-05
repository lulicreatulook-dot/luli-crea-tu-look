# Reporte de Cierre — Luli Crea Tu Look

**Fecha:** 2026-05-05
**Estado:** Producción funcional — pendientes menores a resolver por Libia
**Repo:** https://github.com/lulicreatulook-dot/luli-crea-tu-look
**URL producción:** https://luli-crea-tu-look.vercel.app (o dominio configurado en Vercel)

---

## Qué se construyó

Tienda online completa para Libia Salazar y Martha Roldán — accesorios de satén para el cabello, Medellín Colombia.

### Tienda pública
- Catálogo de productos con filtros por categoría
- 7 categorías: Todos / Scrunchies / Gorritos Adulto / Gorritos Niños / Gorros Grandes / Fundas Almohada / Accesorios
- Modal de producto con selector de variantes de color/estilo
- Stock por variante: botones tachados y deshabilitados cuando stock = 0
- Primera variante disponible preseleccionada automáticamente
- Carrito de compras con contador en header
- Checkout por WhatsApp — mensaje prearmado con el pedido completo
- Botón de pago por Nequi con QR configurable
- Bilingüe ES/EN con toggle en header (colores traducidos automáticamente)
- Sección Ciclovía activable desde admin: "Cada domingo en la bahía del Edificio One Plaza Center, Av. El Poblado, Medellín"
- FAB de WhatsApp fijo
- Toast de confirmación al agregar al carrito

### Panel de administración (`/admin`)
- Login con contraseña (protegido por HMAC-SHA256 diario — sin sesiones en servidor)
- Tab Productos: lista con foto, precio, categoría, chips de stock por variante, toggle disponibilidad rápido
- Chips de stock: verde (>5), amarillo (1-5), rojo (0)
- Modal agregar/editar: nombre, descripción ES+EN, precio, categoría, foto, variantes con nombre+stock, toggle disponibilidad
- Variantes dinámicas: agregar/quitar filas, stock individual por variante
- Si no hay variantes: campo de stock general
- Upload de fotos por Cloudinary (widget integrado)
- Tab Ciclovía: toggle ON/OFF para mostrar/ocultar la sección en la tienda
- Tab Config: WhatsApp, Nequi número, QR Nequi (upload Cloudinary), Cloudinary cloud name + preset

---

## Inventario cargado en producción

19 productos en Redis (`luli:productos`). 11 visibles, 8 ocultos hasta confirmar precio/stock.

| Producto | Categoría | Precio | Estado |
|---|---|---|---|
| Donita Satín Mini | scrunchies | $2.000 | visible — 18 variantes |
| Dona Clásica Satín | scrunchies | $3.000 | visible — 17 variantes |
| Dona Color Satín | scrunchies | $2.000 | visible — 20 variantes |
| Gran Dona de Seda | scrunchies | $5.000 | visible — 5 variantes |
| Dona Neón Brillante | scrunchies | $5.000 | visible — 3 variantes |
| Gorrito Satín con Elástico | gorritos-adulto | $9.000 | visible — 19 variantes |
| Gorrito Satín con Banda | gorritos-adulto | $9.000 | visible — 25 variantes |
| Mini Gorrito Satín | gorritos-adulto | $2.000 | visible — 19 variantes |
| Gorrito Infantil Satín | gorritos-ninos | $15.000 | visible — 12 variantes compuestas |
| Turbante Doble Faz con Elástico | gorros-grandes | $18.000 | visible — 2 variantes |
| **Turbante Reversible Libre** | gorros-grandes | ⚠️ sin precio | oculto — confirmar precio |
| Gorro Largo Satín Moto | gorros-grandes | $18.000 | visible — 1 variante |
| **Gorro Premium de Seda** | gorros-grandes | ⚠️ sin precio | oculto — confirmar precio |
| **Gorro Satín Estampado** | gorros-grandes | ⚠️ sin precio | oculto — confirmar precio y stock |
| Funda Satín 50×70 | fundas | $16.000 | visible — 4 variantes |
| **Funda Satín 50×75** | fundas | $18.000 | oculto — confirmar colores disponibles |
| **Funda Satín 55×85** | fundas | $20.000 | oculto — confirmar colores disponibles |
| **Hebilla Elegante** | accesorios | ⚠️ sin precio | oculto — confirmar precio y stock |
| **Toalla Microfibra** | accesorios | ⚠️ sin precio | oculto — confirmar precio y stock |

---

## Pendientes para Libia

### Inmediato
1. **Subir fotos de productos** — Admin → Productos → editar cada uno → Subir foto desde galería
2. **Configurar Cloudinary** (si no está hecho) — Admin → Configuración → Cloud name + Upload preset `luli_unsigned`
3. **Confirmar WhatsApp y Nequi** — Admin → Configuración → número + QR

### Cuando tenga precios/stock confirmados
4. **Turbante Reversible Libre** — Admin → editar → poner precio → activar disponibilidad
5. **Gorro Premium de Seda** — idem
6. **Gorro Satín Estampado** — idem + agregar variantes/stock
7. **Hebilla Elegante** — idem + actualizar stock de las 4 variantes
8. **Toalla Microfibra** — idem
9. **Funda 50×75 y 55×85** — Admin → editar → agregar variantes de color → activar

### Consultar con Libia
10. **Gorrito Satín con Banda** — verificar si el inventario es 1 conteo único o 2 conteos separados (con banda y sin banda)

---

## Cómo volver a cargar el inventario (si se necesita)

```bash
cd C:\Users\jsala\trazzos-dev-system\experiments\luli-crea-tu-look
vercel env pull .env.local   # solo si las credenciales cambiaron
node seed.js
```

> El seed sobreescribe todos los productos. Usarlo solo si se hace un reset completo — para cambios parciales usar el admin.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | Vanilla HTML + CSS + JS — sin framework, sin bundler |
| Backend | Vercel Serverless Functions (`/api/*.js`) — Node.js CJS |
| Base de datos | Upstash Redis (Vercel KV) |
| Imágenes | Cloudinary — upload widget en admin |
| Auth admin | HMAC-SHA256 token diario — stateless, sin sesiones en servidor |
| Deploy | Vercel — auto-deploy desde master en GitHub |
| i18n | Sistema propio — `data-i18n` attrs + `t(key)` + `tColor()` |

**Variables de entorno en Vercel:**
- `kv_KV_REST_API_URL` — Upstash Redis URL
- `kv_KV_REST_API_TOKEN` — Upstash Redis token
- `ADMIN_PASSWORD` — contraseña del panel admin
- `ADMIN_SECRET` — secret para HMAC del token de sesión

---

## Decisiones técnicas no obvias

**1. Stock en variantes, no en tabla separada**
El stock vive dentro del modal de cada producto. No hay pestaña de "Inventario" separada — el flujo del admin es: editar producto → ver y actualizar stock de cada variante.

**2. Retrocompatibilidad silenciosa de variantes**
`normalizarVariantes()` convierte `["Rosa", "Azul"]` (formato viejo) a `[{nombre:"Rosa", stock:0}]` en runtime. No se hizo migración de datos en Redis para no romper nada existente.

**3. `disponible` vs stock**
El flag `disponible: false` existe para deshabilitar manualmente un producto sin vaciar su stock. `estaDisponible(p)` combina ambas lógicas: si hay variantes, verifica que al menos una tenga stock > 0; si no, verifica el campo `stock` general.

**4. Productos ocultos como placeholder**
Productos con precio sin confirmar tienen `precio: 1, disponible: false`. Están cargados en Redis pero no aparecen en la tienda. Libia los activa desde el admin sin necesidad de correr el seed de nuevo.

**5. Bug i18n en selección de variante**
La versión original comparaba `btn.textContent === v` — fallaba cuando el idioma era EN (el texto del botón estaba en inglés pero `v` era el nombre en español). Corregido con `btn.dataset.variante === v`.

**6. Seed sin dotenv**
`seed.js` usa un parser inline de `.env.local` (`fs.readFileSync` + split por `=`). No agrega `dotenv` como dependencia porque `package.json` solo tiene `@upstash/redis`.
