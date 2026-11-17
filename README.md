# Pieca® — Frontend

SPA de la tienda de piedras Pieca. React 19 · Vite · Bootstrap · JWT contra el backend Spring Boot.

## Stack
- React 19 + react-router (BrowserRouter con basename para GitHub Pages)
- Bootstrap (tema oscuro fijado; estética blanco/negro independiente del SO)
- react-easy-crop + canvas (recorte de imágenes en el navegador)
- Karma + Jasmine + esbuild (tests con cobertura)

## Puesta en marcha
```bash
npm install
npm run dev        # http://localhost:5173
```
Requiere el backend corriendo en `http://localhost:8080` (ver README del backend).
Para apuntar a otro backend, crea un `.env`:
```
VITE_API_URL=http://localhost:8080
```

## Scripts
| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm test` | Suite Karma/Jasmine (fetch mockeado, sin red real) |
| `npm run deploy` | Publica `dist/` en GitHub Pages |

## Arquitectura
- `src/lib/api.js` — única capa de red: token Bearer, timeout, manejo de 401 (logout global),
  mensajes de error del backend, y `resolveImageUrl` (assets del frontend vs `/uploads` del backend).
- `src/lib/auth.jsx` — `AuthProvider`/`useAuth`: sesión, rehidratación vía `/api/auth/me`, helpers `isAdmin/isSeller/isStaff`.
- `src/lib/cart.js` — carrito en localStorage (ids de BD + cantidad), enriquecido con datos de la API.
- `src/components/RequireRole.jsx` — guard de rutas (login si anónimo, home si rol insuficiente).
- `src/components/admin/` — RockForm (validación + upload + recorte + preview), RocksTable, UsersTable, SalesTable.

## Rutas
| Ruta | Acceso |
|---|---|
| `/`, `/catalog`, `/product/:id`, `/blogs`, `/contact` | Público |
| `/login`, `/register` | Público |
| `/cart`, `/orders`, `/receipt/:id` | Autenticado |
| `/admin` | ADMIN (todo) y SELLER (inventario lectura + ventas/estados) |

## Flujo de compra
Checkout → `POST /api/v1/orders` (el backend simula ~5 s de pago) → éxito: carrito se limpia y
navega a la boleta persistida; fallo de red/stock: error visible y el carrito se conserva.
El estado real siempre se reconcilia en **Mis Pedidos**.

## Notas
- El registro público solo crea ROLE_CLIENT; vendedor/admin se gestionan desde el backend.
- Ocultar el panel en la UI es solo UX: la autorización real vive en el backend (401/403).
- Las imágenes semilla viven en `public/assets/`; las subidas por el admin las sirve el backend.