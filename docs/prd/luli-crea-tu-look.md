# PRD — Luli Crea Tu Look

**Cliente:** Libia Salazar + Marta (tía y prima de Jennifer Salazar Duke)
**Fecha de reunión:** no registrada
**Versión:** v0.1 — borrador inicial
**Estado:** pendiente validación del cliente

---

## 1. Contexto del negocio

Luli Crea Tu Look es una marca de accesorios para el cuidado y estilismo del cabello (ganchitos, cintas, vinchas, hebillas, accesorios artesanales y de tendencia). Opera en Medellín, Colombia, actualmente a través de redes sociales de manera informal. Las dueñas son Libia Salazar y Marta (prima de Jennifer). El objetivo es profesionalizar las ventas con una tienda online propia que facilite el pedido y amplíe el alcance geográfico. No hay pasarela de pago integrada ni sistema de gestión existente — todo el comercio ocurre por conversación en WhatsApp. Número de usuarios actual: no registrado.

Narrativa de marca: *"Para mujeres que cuidan cómo se ven y sienten — sin complicaciones. Desde Medellín con amor."* Posicionamiento: cálido, accesible, femenino y local. No es lujo — es belleza cotidiana con personalidad.

---

## 2. Problema

Las ventas están atadas a la informalidad de las redes sociales: no hay catálogo centralizado, el proceso de pedido es manual, no hay visibilidad de inventario y el alcance geográfico es limitado. Libia y Marta dedican tiempo a responder preguntas repetitivas (precios, disponibilidad) que una tienda online resolvería automáticamente. No hay forma de que un cliente haga un pedido estructurado sin intervención manual desde el primer mensaje.

---

## 3. Usuarios objetivo

| Tipo de usuario | Descripción | Acceso |
|---|---|---|
| Compradora | Mujer, predominantemente adulta joven, desde Medellín, compra accesorios de cabello para uso cotidiano. Sin registro ni contraseña. | Web (mobile-first) |
| Admin (Libia / Marta) | Dueñas del negocio, comparten credenciales. Gestionan productos, toggle ciclovía y config de pagos. Acceso desde celular. | Web — `/admin` con contraseña |

---

## 4. Solución propuesta

Tienda online estática (HTML/CSS/JS vanilla) desplegada en Vercel. Sin base de datos relacional — los datos de productos y configuración viven en Vercel KV (Redis). El flujo de compra termina en WhatsApp: el carrito genera un mensaje pre-llenado con el resumen del pedido. El pago se realiza por Nequi fuera de la plataforma.

Panel de administración en `/admin`: protegido por contraseña, mobile-first, permite gestionar productos (altas/bajas/edición), subir fotos a Cloudinary, y activar/desactivar la sección de Ciclovía sin redeploy.

---

## 5. Requerimientos funcionales

- [ ] Catálogo de productos en el home con foto, nombre, precio y botón "Agregar al carrito"
- [ ] Filtro por categoría (vinchas, ganchitos, cintas, hebillas, sets, accesorios especiales)
- [ ] Ficha de producto: fotos, descripción, precio, colores/variantes, botón agregar
- [ ] Carrito persistido en `localStorage`: lista, cantidades, subtotal, total
- [ ] Generación de link `wa.me` con mensaje pre-llenado desde el carrito
- [ ] Sección Ciclovía: aparece/desaparece según toggle en admin (sin redeploy)
- [ ] Panel admin — Bloque ciclovía: toggle ON/OFF con botón Guardar
- [ ] Panel admin — Bloque productos: lista, editar, cambiar disponibilidad, eliminar, agregar nuevo
- [ ] Panel admin — Bloque config: WhatsApp, número Nequi, QR Nequi (subir imagen)
- [ ] Subida de fotos a Cloudinary desde el panel admin via Upload Widget
- [ ] Autenticación admin: contraseña validada contra `ADMIN_PASSWORD` env var, token en `sessionStorage`
- [ ] API serverless (`/api/config`, `/api/productos`, `/api/update`, `/api/login`) con Vercel Functions
- [ ] Datos dinámicos en Vercel KV: `luli:config` y `luli:productos`
- [ ] QR Nequi visible en el carrito / checkout
- [ ] Botón flotante de WhatsApp en mobile

---

## 6. Requerimientos no funcionales

- **Performance:** páginas estáticas + CDN Cloudinary para imágenes — rápidas en mobile con conexión promedio colombiana
- **Seguridad:** contraseña admin en variable de entorno; token HMAC-SHA256 diario en `sessionStorage`; escrituras requieren `Authorization: Bearer`
- **Escala esperada:** pequeño negocio local; free tier de Vercel, Cloudinary y Vercel KV es suficiente en V1
- **Disponibilidad:** Vercel free tier

---

## 7. Restricciones técnicas

- **Sistemas a integrar:** WhatsApp (`wa.me`), Nequi (QR + número), Cloudinary (imágenes), Servientrega (solo informativo)
- **Stack:** HTML/CSS/JS vanilla; Vercel Functions (`/api/*.js`); Vercel KV (`@vercel/kv`)
- **Plazo:** no definido
- **Presupuesto:** $0 — todo en free tiers

---

## 8. Scope por versiones

| Versión | Contenido | Objetivo |
|---|---|---|
| v0 (MVP) | Home + catálogo, ficha de producto (modal), carrito localStorage, checkout WhatsApp, Nequi QR, sección Ciclovía, panel admin completo, subdominio Vercel, Cloudinary | Tienda funcional lista para vender desde el día 1 |
| v1 | QR Nequi real, fotos de productos reales (6–10 SKUs), subdominio definido | Lanzamiento público |
| v2+ | Dominio propio, pasarela de pago (Wompi / MercadoPago), envíos nacionales, reseñas, WhatsApp automatizado | Escalar y reducir fricción operativa |

---

## 9. Criterios de éxito

- Libia y Marta reciben pedidos estructurados por WhatsApp sin tener que pedir precios ni disponibilidad manualmente
- El panel admin es usable desde el celular sin ayuda técnica
- El toggle de Ciclovía funciona en menos de 5 segundos sin redeploy
- Los productos se pueden agregar/editar desde el celular con fotos propias

---

## 10. Explícitamente fuera de scope (V1)

- Pasarela de pago integrada
- Envíos nacionales con cálculo de costo
- Registro / login de clientes
- Reseñas
- WhatsApp automatizado
- Dominio propio
- Modo oscuro

---

## 11. Preguntas abiertas

| # | Pregunta | Bloque afectado | Impacto si no se responde |
|---|---|---|---|
| 1 | ¿Cuál será el nombre del subdominio en Vercel? | Deploy + links | El link `wa.me` y todos los links compartibles quedan incorrectos |
| 2 | ¿Lista inicial de productos con nombre, precio, descripción y categoría? | Catálogo / KV | Sin productos reales no se puede hacer el lanzamiento |
| 3 | ¿Cuándo activa Libia Nequi Negocio para el QR real? | Checkout | Placeholder hasta que lo active |
| 4 | ¿Cuál es el número de Nequi del negocio? | Config admin | `nequi_numero` queda vacío |
