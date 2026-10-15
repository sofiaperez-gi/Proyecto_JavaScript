// Punto de entrada de la aplicación: inicialización de módulos en el DOM

import { iniciarCatalogo } from './catalogo.js';
import { iniciarCarrito } from './carrito.js';

function inicializar() {
  iniciarCatalogo();
  iniciarCarrito();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}

