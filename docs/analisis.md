# Análisis y Documentación del Sistema: FakeStore

## 1. Decisiones de UI / UX
- **Enfoque Semántico y Accesibilidad:** Uso de etiquetas semánticas directas (`<header>`, `<section>`, `<main>`, `<aside>`) para una navegación accesible y libre de wrappers innecesarios.
- **Jerarquía Visual y Contraste:** Definición de una paleta accesible en `css/base.css` mediante variables CSS en `:root`.
- **Feedback al Usuario:** Contenedor `#mensaje-estado` para informar cargas, errores y estados vacíos sin bloquear la interfaz.
- **Interacción del Carrito:** Panel lateral (`<aside id="carrito" hidden>`) controlado exclusivamente mediante manipulación del atributo `hidden` desde JavaScript.

## 2. Estructura y Modelo de Datos del Objeto Carrito
- **Representación en Memoria:** Diccionario u objeto indexado por ID del producto para búsquedas y actualizaciones en tiempo constante $O(1)$.
- **Estructura Propuesta:**
  ```javascript
  {
    "idProducto": {
      "id": 1,
      "title": "Nombre del Producto",
      "price": 109.95,
      "cantidad": 2,
      "image": "url_imagen"
    }
  }
  ```
- **Persistencia:** Sincronización con `localStorage` bajo una clave única (`fakeStore_carrito`), deserializando al iniciar la aplicación.

## 3. Justificación de Filtros, Búsqueda y Ordenamiento
- **Búsqueda en Tiempo Real (`input`):** Filtrado sensible a mayúsculas/minúsculas sobre el título y descripción del producto.
- **Filtro por Categoría (`change`):** Poblado dinámico de `<select id="filtro-categoria">` a partir de los datos de la API para mantener consistencia.
- **Ordenamiento por Precio (`change`):** Orden ascendente y descendente aplicado sobre la lista filtrada activa sin mutar la respuesta original de la API.
- **Composición de Filtros:** Aplicación encadenada de búsqueda + categoría + orden sobre el array en memoria (`listaProductos`).

