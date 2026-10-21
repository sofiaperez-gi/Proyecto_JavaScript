# FakeStore / FakeShop

Aplicación web interactiva desarrollada con **HTML5 semántico**, **CSS3 moderno** y **JavaScript Vanilla (ES6 Modules)** que consume en tiempo real la API pública [FakeStore API](https://fakestoreapi.com/products).

El proyecto fue diseñado y estructurado bajo buenas prácticas de desarrollo web frontend, accesibilidad web (WAI-ARIA), modularización y persistencia local sin dependencias de frameworks ni librerías externas.

---

## Funcionalidades Principales

### 1. Catálogo y Filtros Interactivos
- **Consumo Asíncrono:** Petición HTTP mediante `fetch` con manejo de errores y estados de carga (`#mensaje-estado`).
- **Búsqueda en Tiempo Real:** Filtrado sensible sobre título y descripción del producto (`input`).
- **Filtro por Categoría:** Poblado dinámico de categorías únicas sin duplicados (`select`).
- **Ordenamiento Multicriterio:** Clasificación por precio (ascendente y descendente) y alfabético por título (A-Z y Z-A).
- **Animaciones y Microinteracciones:** Entrada suave de tarjetas al scroll y confirmación visual momentánea (`✓ Agregado`).

### 2. Carrusel Modal de Productos (Accesible por Clic y Teclado)
- **Apertura bajo Demanda:** El carrusel no ocupa espacio fijo en la pantalla principal; se abre como ventana modal centrada al hacer clic sobre cualquier tarjeta del catálogo.
- **Navegación por Teclado:** Captura nativa de eventos `keydown` con las flechas `ArrowLeft` y `ArrowRight` utilizando el atributo de accesibilidad `tabindex="0"`.
- **Navegación Visual:** Botones interactivos anterior/siguiente (`◄` y `►`) y contador de posición dinámico (`3 / 20`).
- **Cierre Multicamino:** Cierre intuitivo mediante el botón `✕`, haciendo clic en el fondo oscuro desenfocado o presionando la tecla `Escape`.
- **Animación Optimizada:** Desplazamiento fluido mediante la propiedad CSS `transform: translateX()`, procesada directamente por la GPU sin provocar reflujos (*reflow*).
- **Compra Directa:** Cada tarjeta del carrusel incluye su botón funcional para añadir el producto al carrito.

### 3. Carrito de Compras y Checkout Simulado
- **Panel Lateral Desplegable:** Estructura en `<aside id="carrito">` con control de visibilidad mediante el atributo nativo HTML5 `hidden`.
- **Gestión Completa de Artículos:** Sumar (`+`), restar (`-`) unidades, eliminación individual y vaciado completo.
- **Cálculo Automático:** Actualización en tiempo real del total a pagar y contador numérico en el encabezado.
- **Formulario de Compra:** Al hacer clic en *Continuar con la compra*, se solicita Nombre completo, Correo electrónico y Dirección de entrega.

### 4. Historial de Compras Independiente
- **Persistencia Desacoplada en `localStorage`:** Los pedidos finalizados se almacenan en una clave separada (`historial_compras`), acumulando compras previas sin sobrescribirlas.
- **Registro Detallado:** Cada orden genera un identificador único autogenerado (`COMPRA-timestamp`), fecha y hora local, datos del comprador, listado de productos adquiridos y monto total.
- **Visualización Inmediata:** Al confirmar el pedido, el carrito se vacía y se presenta automáticamente la vista del historial con un aviso visual de confirmación (*"¡Compra realizada con éxito!"*).
- **Acceso Rápido:** Botón de acceso directo en el encabezado y en el pie del carrito para consultar o vaciar el historial en cualquier momento.

---

## División de Trabajo por Ramas

El proyecto está diseñado para trabajo colaborativo mediante ramas independientes en Git:

- **Desarrollador A (`feature/catalogo-filtros`):**
  - Consumo y manejo de errores de la API externa (`js/api.js`).
  - Renderizado dinámico del catálogo y lógica de filtros encadenados (`js/catalogo.js`).
  - Visor modal del carrusel con navegación por teclado y botones (`js/catalogo.js`).
  - Estilos del catálogo, cuadrícula responsive y modal (`css/catalogo2.css`).

- **Desarrollador B (`feature/carrito-compras`):**
  - Estado global del carrito y persistencia en `localStorage` (`js/carrito.js`).
  - Subvistas del panel lateral: carrito, checkout e historial (`js/carrito.js`).
  - Validación del formulario de compra y registro acumulativo de órdenes.
  - Estilos del panel lateral, drawer y elementos interactivos (`css/carrito2.css`).

- **Integración y Soporte General (`develop` / `main`):**
  - Estructura semántica base y modales (`index.html`).
  - Ciclo de inicialización de la aplicación (`js/main.js`).
  - Sistema de diseño, variables de color y tipografía (`css/base2.css`).
  - Adaptabilidad para móviles, tablets y pantallas grandes (`css/responsive.css`).

---

## Arquitectura y Decisiones Técnicas

1. **Separación Estricta de Responsabilidades:**
   - **HTML:** Estructura puramente semántica (`<header>`, `<section>`, `<main>`, `<aside>`) sin divs redundantes (*divitis*).
   - **CSS:** Centralización de diseño con variables nativas en `:root`, Flexbox, Grid y media queries organizadas.
   - **JavaScript:** Lógica reactiva mediante módulos ES6 nativos, delegación de eventos y API nativa del DOM.

2. **Accesibilidad Web (WAI-ARIA):**
   - Uso de `tabindex="0"` para dotar de foco a contenedores interactivos.
   - Roles semánticos `role="region"` y `role="dialog"` con atributos `aria-modal="true"`.
   - Control de visibilidad con el atributo booleano nativo `hidden`.

3. **Estrategia de Almacenamiento Local (`localStorage`):**
   - Clave `carrito_fakestore`: Representa el estado efímero y mutable de artículos pendientes.
   - Clave `historial_compras`: Registro inmutable acumulativo de transacciones confirmadas.

---

## Estructura de Archivos

```text
├── css/
│   ├── base2.css         # Variables globales, reset CSS y tipografía
│   ├── catalogo2.css     # Estilos del catálogo, tarjetas y visor modal
│   ├── carrito2.css      # Estilos del panel lateral, checkout e historial
│   └── responsive.css    # Reglas de diseño responsivo (Desktop, Tablet, Mobile)
├── docs/
│   ├── analisis.md       # Análisis de UI/UX, filtros y modelo de datos
│   ├── wireframes.md     # Documentación de diseño y bocetos UI/UX
│   └── wireframes/
│       ├── boceto-principal.png # Mockup principal de referencia (Maison Studio)
│       └── wireframes.md # Desglose de componentes y wireframes
├── img/
│   └── favicon-tienda.png # Favicon de la aplicación
├── js/
│   ├── api.js            # Conexión y consumo asíncrono de la FakeStore API
│   ├── catalogo.js       # Catálogo, filtros, búsqueda y carrusel modal
│   ├── carrito.js        # Carrito, totales, checkout simulado e historial
│   └── main.js           # Punto de entrada e inicialización de módulos
├── index.html            # Estructura semántica principal y modales
└── README.md             # Documentación general del proyecto
```

---

## Ejecución Local

Dado que el proyecto utiliza **módulos nativos de JavaScript (`type="module"`)**, se requiere ejecutarlo a través de un servidor HTTP local para evitar restricciones de seguridad CORS del navegador:

1. **Opción A (Recomendada con Node.js):**
   ```bash
   npx serve .
   ```

2. **Opción B (Python 3):**
   ```bash
   python3 -m http.server 3000
   ```

3. **Opción C (Visual Studio Code):**
   Abrir `index.html` con la extensión **Live Server**.
