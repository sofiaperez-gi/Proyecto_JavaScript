// Punto de entrada de la aplicación: inicialización de módulos en el DOM

import { iniciarCatalogo } from './catalogo.js';
import { iniciarCarrito } from './carrito.js';

document.addEventListener('DOMContentLoaded', () => {
  iniciarCatalogo();
  iniciarCarrito();
});

