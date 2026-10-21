import { iniciarCatalogo, iniciarCarrusel } from './catalogo.js';
import { iniciarCarrito } from './carrito.js';
import { obtenerProductos } from './api.js';

// Inicializa módulos y pasa productos al carrusel
async function inicializar() {
  iniciarCatalogo();
  iniciarCarrito();
  iniciarCarrusel(await obtenerProductos());
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', inicializar)
  : inicializar();
