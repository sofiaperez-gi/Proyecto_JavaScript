// Desarrollador A: Módulo del catálogo, búsqueda, filtros y renderizado

import { obtenerProductos } from './api.js';

let listaProductos = [];

// Busca y retorna un producto de la lista en memoria según su identificador
export function obtenerProductoPorId(id) {
  return listaProductos.find((producto) => producto.id === Number(id));
}

// Extrae categorías únicas y las inserta dinámicamente en el selector
export function cargarCategorias(productos) {
  const selectCategoria = document.getElementById('filtro-categoria');
  if (!selectCategoria) return;

  const categorias = [...new Set(productos.map((producto) => producto.category))];
  selectCategoria.innerHTML = '<option value="">Todas las categorías</option>';

  categorias.forEach((categoria) => {
    const opcion = document.createElement('option');
    opcion.value = categoria;
    opcion.textContent = categoria;
    selectCategoria.appendChild(opcion);
  });
}

// Renderiza las tarjetas de los productos en el catálogo sin divs innecesarios
export function renderizarProductos(productos) {
  const contenedorCatalogo = document.getElementById('catalogo');
  if (!contenedorCatalogo) return;

  const mensajeEstado = document.getElementById('mensaje-estado');
  contenedorCatalogo.innerHTML = '';
  if (mensajeEstado) {
    contenedorCatalogo.appendChild(mensajeEstado);
  }

  const fragmento = document.createDocumentFragment();

  productos.forEach((producto) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto';
    tarjeta.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}">
      <h3>${producto.title}</h3>
      <p>${producto.description}</p>
      <strong>$${Number(producto.price).toFixed(2)}</strong>
      <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
    `;
    fragmento.appendChild(tarjeta);
  });

  contenedorCatalogo.appendChild(fragmento);
}

// Inicializa el catálogo, obtiene los datos de la API y controla el estado
export async function iniciarCatalogo() {
  const mensajeEstado = document.getElementById('mensaje-estado');

  try {
    if (mensajeEstado) {
      mensajeEstado.textContent = 'Cargando productos...';
      mensajeEstado.hidden = false;
    }

    listaProductos = await obtenerProductos();

    if (mensajeEstado) {
      mensajeEstado.hidden = true;
    }

    cargarCategorias(listaProductos);
    renderizarProductos(listaProductos);
  } catch (error) {
    if (mensajeEstado) {
      mensajeEstado.textContent = 'Hubo un error al cargar los productos. Intenta nuevamente más tarde.';
      mensajeEstado.hidden = false;
    }
  }
}
