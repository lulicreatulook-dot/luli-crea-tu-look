# Skill Registry — Luli Crea Tu Look

**Stack:** HTML/CSS/JS Vanilla + Vercel Serverless Functions + Vercel KV + Cloudinary
**Proyecto:** luli-crea-tu-look
**Dueña:** Libia Salazar (repo en su cuenta personal de GitHub)

---

## User Skills — Trigger Table

| Skill | Trigger automático |
|-------|-------------------|
| `brief-intake` | Nuevas reuniones con Libia/Marta, feedback de uso, cambio de requerimientos |
| `arquitecto` | Decisiones de arquitectura, nuevas integraciones, refactors estructurales |
| `executor` | Implementación de tareas definidas por el arquitecto |
| `code-review` | Al cerrar un módulo o feature completo antes de deploy |
| `security-audit` | Antes de cada deploy a producción — especialmente si se tocan `/api/*.js` |
| `client-report` | Entrega de una versión (v0, v1, etc.) a Libia/Marta |

---

## Convenciones del proyecto

### Estructura de archivos

```
luli-crea-tu-look/
├── index.html          ← storefront (tienda)
├── admin.html          ← panel admin en /admin
├── style.css           ← estilos del storefront
├── admin.css           ← estilos del panel admin
├── carrito.js          ← lógica de carrito (localStorage)
├── main.js             ← catálogo, filtros, modal de producto
├── admin.js            ← autenticación, CRUD de productos, config
├── assets/             ← imágenes estáticas (no de Cloudinary)
├── api/
│   ├── _auth.js        ← helper HMAC — no es un endpoint público
│   ├── login.js        ← POST /api/login
│   ├── config.js       ← GET /api/config
│   ├── productos.js    ← GET /api/productos
│   └── update.js       ← POST /api/update (requiere token)
├── docs/
│   ├── prd/            ← PRD del proyecto
│   ├── decisions/      ← ADRs
│   └── reports/        ← reportes de entrega
├── openspec/changes/   ← artefactos SDD por cambio
└── memory/context/     ← contexto activo del proyecto
```

### Convenciones de código

- JS vanilla — sin frameworks, sin bundler, sin TypeScript
- Estado del carrito en `localStorage` key `luli_carrito`
- Token admin en `sessionStorage` key `luli_token`
- `configGlobal` es estado compartido entre `carrito.js` y `main.js` — patrón intencional
- Clave compuesta de ítem de carrito: `productId||variante`
- IDs de producto generados en cliente: `prod_${Date.now()}` — suficiente para este escala
- `innerHTML` con datos de API debe escapar caracteres conflictivos (ver AGENTS.md)
- Precios en COP sin centavos — `toLocaleString('es-CO')` → `$10.000`

### Variables de entorno requeridas

```
ADMIN_PASSWORD        ← contraseña del panel admin
SERVER_SECRET         ← secreto HMAC para firmar tokens
KV_REST_API_URL       ← auto-set por Vercel al vincular KV store
KV_REST_API_TOKEN     ← auto-set por Vercel al vincular KV store
```

### Autenticación

- Token: `HMAC-SHA256(ADMIN_PASSWORD + ":" + YYYY-MM-DD, SERVER_SECRET)`
- Rota diariamente a medianoche UTC
- `sessionStorage` — se borra al cerrar el navegador
- Todas las operaciones de escritura a KV requieren `Authorization: Bearer {token}`

---

## Compact Rules (auto-resolved por el orchestrator)

### vanilla-js
- No frameworks, no bundler
- `innerHTML` con datos de API: escapar `<`, `>`, `"`, `'`, `&` antes de insertar
- `fetch()` siempre con try-catch o `.catch()`
- Estado global mínimo: solo `configGlobal`, `todosLosProductos`, `carritoAbierto`

### vercel-kv
- Keys del proyecto: `luli:config`, `luli:productos`
- Siempre hacer seeding si la key devuelve `null` (primer deploy)
- `kv.get()` puede devolver `null` — nunca asumir que existe

### vercel-api
- Handler exportado como `module.exports = async function handler(req, res)`
- Verificar método HTTP (`req.method`) antes de procesar
- Verificar token en endpoints de escritura con `verifyRequest(req)` de `_auth.js`
- `_auth.js` no es un endpoint — `api/` expone solo los archivos sin `_` prefix

---

## SDD — Artifact Store

Modo: `openspec`
Path: `openspec/changes/`

---

## Decisiones técnicas tomadas (resumen)

| Decisión | Elegido | Razón |
|---|---|---|
| Auth | HMAC-SHA256 diario | Stateless, sin KV session table, rota sola |
| Storage | Vercel KV | Free tier, suficiente para este escala, sin infra |
| Imágenes | Cloudinary Upload Widget | Sin procesar imágenes en el servidor |
| Carrito | localStorage | No requiere backend, persiste entre sesiones |
| Checkout | wa.me link | Sin pasarela de pago — apropiado para V0 |
