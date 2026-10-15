# FakeStore

Aplicación web interactiva desarrollada con HTML5 semántico, CSS3 y JavaScript Vanilla (ES6 Modules) que consume la API pública [FakeStore API](https://fakestoreapi.com/products).

## División de Trabajo por Ramas

El proyecto está diseñado para desarrollarse en paralelo entre 2 desarrolladores en ramas independientes:

- **Desarrollador A (`feature/catalogo-filtros`):**
  - Consumo de la API con `fetch`.
  - Renderizado dinámico del catálogo de productos en el DOM.
  - Lógica de búsqueda (`input`), filtrado por categoría y ordenamiento por precio (`change`).
  - Archivos asignados: `js/api.js`, `js/catalogo.js`, `css/catalogo.css`.

- **Desarrollador B (`feature/carrito-compras`):**
  - Lógica del objeto carrito de compras.
  - Manejo de eventos (`click`), cálculo de subtotales y total general.
  - Persistencia de datos en `localStorage`.
  - Apertura/cierre y renderizado del carrito en el DOM.
  - Archivos asignados: `js/carrito.js`, `css/carrito.css`.

## Arquitectura y Buenas Prácticas

1. **Separación de Responsabilidades:**
   - **CSS:** Exclusivamente apariencia visual (variables en `:root`, Flexbox/Grid, tipografía y espaciado).
   - **JavaScript:** Totalidad de la lógica, eventos, filtrado de datos y control de visibilidad (atributo `hidden`).
2. **HTML Semántico sin Divitis:** Estructura plana usando `<header>`, `<section>`, `<main>` y `<aside>`.
3. **Módulos ES6:** Separación estricta en archivos modulares independientes para evitar conflictos de merge.

## Estructura del Proyecto

```text
├── css/
│   ├── base.css          # Variables globales y reset base
│   ├── catalogo.css      # Estilos visuales del catálogo (Dev A)
│   └── carrito.css       # Estilos visuales del carrito (Dev B)
├── docs/
│   ├── analisis.md       # Documentación de UI/UX, filtros y modelo de datos
│   └── wireframes/
│       └── .gitkeep      # Directorio para bocetos y wireframes
├── js/
│   ├── api.js            # Consumo de la FakeStore API (Dev A)
│   ├── catalogo.js       # Catálogo, filtros y búsqueda (Dev A)
│   ├── carrito.js        # Carrito, totales y persistencia (Dev B)
│   └── main.js           # Punto de entrada e inicialización
├── index.html            # Estructura semántica principal
└── README.md             # Guía del proyecto
```

## Ejecución Local

Para visualizar el proyecto localmente con soporte de módulos ES6, ejecuta un servidor HTTP local (por ejemplo usando la extensión Live Server de VS Code o `npx serve`):

```bash
npx serve .
```

