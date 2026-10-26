# Pieca®. E-commerce de piedras

Aplicación web tipo SPA construida con React + Vite para la venta de piedras exóticas. Incluye catálogo, detalle de producto, carrito, panel de administración con gestión de inventario/usuarios/ventas, sistema de registro y login, blog y formulario de contacto.

El proyecto forma parte del curso FSD II de DUOC UC y cuenta con una suite de 72 pruebas unitarias con 100% de cobertura en sentencias, ramas, funciones y líneas.

# Tabla de contenidos
- Características
- Stack tecnológico
- Requisitos previos
- Instalación
- Scripts disponibles
- Estructura del proyecto
- Rutas de la aplicación
- Testing y cobertura
- Configuración de Karma
- Almacenamiento local
- Advertencias conocidas
- Autor

# Características
## Catálogo y compra
- Home con carrusel interactivo, sección "Sobre nosotros" y video promocional.
- Catálogo con búsqueda en tiempo real, conteo dinámico de resultados y estado vacío.
- Detalle de producto con especificaciones técnicas (peso, dimensiones, volumen, costo de envío) y formato de precio en CLP.
- Carrito de compras con incremento/decremento de cantidad, eliminación de ítems, cálculo de total y checkout.
- Recibo de compra con detalle del pedido, estado y fecha formateada.

## Autenticación y usuario
- Registro con validación de RUT chileno (módulo 11) y dominio de correo permitido (@duoc.cl, @profesor.duoc.cl, @gmail.com).
- Login con validación de dominio y persistencia de sesión en localStorage.
- Header dinámico que cambia según el estado de sesión y permite cerrar sesión.

## Panel de administración
- Inventario con tabla de rocas, imagen, precio, dimensiones y eliminación con confirmación.
- Alta de rocas con formulario validado.
- Usuarios con tabla de usuarios mock + usuario activo.
- Ventas con tabla de ventas mock + último recibo generado.

## Contenido
- Blog con listado de posts desde JSON.
- Contacto con formulario, validación y mensaje de éxito.

# Stack tecnológico

| Categoría	| Tecnología |
| --------- | ---------- |
|Framework UI |	React 18 |
|Build tool	| Vite 8|
|Router	|React Router 7|
|Estilos	|Bootstrap 5 + CSS custom|
|Testing	|Karma 6.4 + Jasmine 5|
|Transpilador de tests	| esbuild 0.24.0 + karma-esbuild|
|Cobertura	|esbuild-plugin-istanbul + karma-coverage|
|Launcher de navegador	| @chiragrupani/karma-chromium-edge-launcher |

# Requisitos previos
- Node.js 26 o superior
- npm 11 o superior
- Microsoft Edge instalado (para las pruebas con EdgeHeadless)

# Instalación
```bash
git clone https://github.com/TECMDUOCUC/Pieca_React_FSD_II.git
cd Pieca_React_FSD_II

# 2. Instalar dependencias
npm install

# 3. (Solo si es la primera vez en un entorno con Vite 8)
#    Instalar dependencias de testing con --legacy-peer-deps
npm install --save-dev \
  karma karma-jasmine karma-coverage \
  karma-esbuild esbuild-plugin-istanbul \
  @chiragrupani/karma-chromium-edge-launcher \
  esbuild@0.24.0 \
  --legacy-peer-deps
```
> Nota sobre --legacy-peer-deps: karma-esbuild fija esbuild@0.24.x, mientras que Vite 8 exige esbuild@^0.27 || ^0.28. El flag resuelve el conflicto de peer dependencies aceptando árboles no estrictamente consistentes. La > combinación es estable en este proyecto

# Scripts disponibles
| Comando	| Descripción |
| ------ | --------- |
|npm run dev	| Inicia el servidor de desarrollo de Vite en http://localhost:XXXX |
|npm run build	| Genera el bundle de producción en dist/ |
|npm run preview	| Sirve el bundle de producción localmente |
|npm test	| Ejecuta las 72 pruebas con Karma + Jasmine y genera el reporte de cobertura |
|npm run test:watch	| Ejecuta las pruebas en modo watch (sin singleRun) |
|npm run lint	 | Ejecuta ESLint sobre el código fuente |


# Estructura del proyecto
> NOTA: No se incluyen las pruebas de vitest (.spec.js)
```
Pieca_React_FSD_II/
├── public/
│   ├── assets/                  # Imágenes de las piedras (1.png … 19.png)
│   └── media/                   # Video promocional (YEAH.mp4)
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AddRockForm.jsx
│   │   │   ├── RocksTable.jsx
│   │   │   ├── SalesTable.jsx
│   │   │   └── UsersTable.jsx
│   │   ├── Blog.jsx
│   │   ├── Carousel.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Home.jsx
│   │   ├── QuoteSection.jsx
│   │   └── RockCard.jsx
│   ├── css/
│   │   └── App.css
│   ├── data/
│   │   ├── blogs.json
│   │   └── rocks.json
│   ├── lib/
│   │   ├── adminData.js          # Mocks y helpers de localStorage
│   │   └── validation.js         # Validación de RUT y dominio
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── Blogs.jsx
│   │   ├── Cart.jsx
│   │   ├── Catalog.jsx
│   │   ├── Contact.jsx
│   │   ├── Index.jsx
│   │   ├── Login.jsx
│   │   ├── Product.jsx
│   │   ├── Receipt.jsx
│   │   └── Register.jsx
│   ├── App.jsx
│   └── main.jsx
├── coverage/                    # Reporte HTML generado por Karma (no versionado)
├── karma.conf.cjs
├── package.json
├── vite.config.js
└── README.md
```

# Rutas de la aplicación
|Ruta	|Componente|	Descripción|
| ----- |-----| -----|
|/	|Index.jsx	|Home con carrusel y secciones informativas|
|/catalog	|Catalog.jsx	|Catálogo con búsqueda|
|/product?id=N	|Product.jsx	|Detalle del producto N|
|/cart	|Cart.jsx	|Carrito de compras|
|/receipt	|Receipt.jsx	|Recibo del último pedido|
|/login	|Login.jsx	|Inicio de sesión|
|/register	|Register.jsx	|Registro de usuario|
|/admin	|Admin.jsx	|Panel de administración|
|/blog	|Blogs.jsx	|Listado de posts|
|/contact	|Contact.jsx	|Formulario de contacto|

# Testing y cobertura
## Ejecutar las pruebas
```bash
npm test
```
La suite arranca EdgeHeadless, ejecuta las 72 pruebas y genera el reporte de cobertura en coverage/html/index.html.
## Resultado actual
```bash
TOTAL: 72 SUCCESS

=============================== Coverage summary ===============================
Statements   : 100% ( 82/82 )
Branches     : 100% ( 14/14 )
Functions    : 100% ( 29/29 )
Lines        : 100% ( 65/65 )
================================================================================
```

## Ver el reporte de cobertura
```bash
# Windows
start coverage/html/index.html

# macOS
open coverage/html/index.html

# Linux
xdg-open coverage/html/index.html
```
El reporte muestra, archivo por archivo, las líneas cubiertas en verde y las no cubiertas en rojo. Al hacer clic en un archivo se ve su código con el detalle línea a línea.

# Distribución de pruebas

|Archivo	|N.º de pruebas	|Cubre|
|-----|-----|-----|
|Admin.spec.js	|10	|Panel, pestañas, alta/baja de rocas, inventario vacío, tablas de usuarios y ventas|
|Cart.spec.js	|8	|Carrito vacío, items desde localStorage, total, eliminar, +/-, corrupción, checkout|
|Catalog.spec.js	|5	|Render desde JSON, conteo, botón "Visitar", búsqueda, estado vacío|
|Blogs.spec.js	|1	|Render desde blogs.json|
|Contact.spec.js	|3	|Render, mensaje de éxito, reinicio del formulario|
|Login.spec.js	|3	|Render, dominio inválido, guardado en localStorage|
|Product.spec.js	|9	|Render, Not Found, formato CLP, añadir al carrito (con/sin sesión), incremento|
|Receipt.spec.js	|4	|Estado vacío, detalle del pedido, formato CLP, fecha|
|Register.spec.js	|5	|Render, RUT inválido, RUT con letras, dominio inválido, registro exitoso|
|Index.spec.js	|1	|Home completa|
|Header.spec.js	|3	|Sin sesión, con sesión, handleLogout|
|Home.spec.js	|2	|Estado loading=true y loading=false|
|Carousel.spec.js	|4	|Estados active/side/far, prev/next, items vacío|
|validation.spec.js	|12	|Dominios permitidos y RUT (DV numérico, K, 0, cuerpo corto, letras, DV incorrecto)|
|adminData.spec.js	|5	|Lectura/escritura de localStorage, recuperación ante JSON corrupto|
|Total	|72| |

# Autores
Proyecto FSD II — DUOC UC
Repositorio: TECMDUOCUC/Pieca_React_FSD_II
Integrantes: 
- Tomás C.
- Martín S.
- Daniel G.
  
# Licencia
Este proyecto es de uso académico. Todos los derechos reservados © 2026 Pieca®.


