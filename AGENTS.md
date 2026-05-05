# Coding Standards — Luli Crea Tu Look

**Stack:** HTML/CSS/JS Vanilla + Vercel Serverless Functions + Vercel KV
**Cliente:** Libia Salazar / Marta
**Deploy:** Vercel (free tier)

Este archivo define los estándares de código que GGA revisa automáticamente en cada commit.

---

## Seguridad — BLOQUEANTE

Ningún commit puede pasar con estos problemas:

- **Sin secretos en código**: `ADMIN_PASSWORD`, `SERVER_SECRET`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` nunca van en código fuente. Solo en `.env` (ignorado por git) o en las env vars de Vercel. Si se detecta algo que parece una key, token o password hardcodeado → bloquear.

- **Sin inyección en innerHTML**: El proyecto usa `innerHTML` para renderizar HTML dinámico. Todo dato que provenga de la API (nombres, precios, variantes) debe escaparse antes de insertarse en el DOM. Si se detecta concatenación directa de datos externos en `innerHTML` sin escape → bloquear.

- **Validación en API routes**: Los handlers en `/api/` deben validar el método HTTP y los campos del body antes de procesarlos. Datos sin validar usados en operaciones KV → bloquear.

- **Token obligatorio en escrituras**: Los endpoints que modifican KV (`/api/update`) deben verificar el token `Authorization: Bearer`. Operación de escritura sin `verifyRequest(req)` → bloquear.

- **Sin console.log con datos sensibles**: No loguear passwords, tokens ni el contenido completo de las keys de KV.

---

## Calidad — ADVERTENCIA

Reportar pero no bloquear:

- **Sin código muerto**: Sin funciones, variables o imports sin usar.

- **Funciones con una responsabilidad**: Una función que mezcla render, fetch y lógica de negocio debe señalarse.

- **Sin duplicación obvia**: Si el mismo bloque aparece más de dos veces idéntico, señalarlo.

- **Nombres descriptivos**: Variables `data`, `result`, `temp` sin contexto → señalar.

- **async sin try-catch**: Funciones que hacen `fetch()` o llamadas a KV sin manejo de errores → señalar.

---

## Estructura — SUGERENCIA

- Archivos JS de más de 250 líneas probablemente pueden dividirse.
- Si una función en `carrito.js` o `main.js` mezcla lógica y render, señalar como candidata a refactor.

---

## Notas para GGA

- El contexto importa: `innerHTML` con variables estáticas del código (no datos de usuario ni de API) no es XSS.
- El `configGlobal` en `carrito.js` es un patrón intencional de estado compartido entre scripts — no es un anti-patrón en este contexto vanilla JS.
- El token HMAC en `api/_auth.js` rota diariamente por diseño. Si ves la fecha en el payload, es esperado.
