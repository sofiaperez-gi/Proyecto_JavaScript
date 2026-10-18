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

  if (productos.length === 0) {
    if (mensajeEstado) {
      mensajeEstado.textContent = 'No se encontraron productos que coincidan con la búsqueda.';
      mensajeEstado.hidden = false;
    }
    return;
  }

  if (mensajeEstado) {
    mensajeEstado.hidden = true;
  }

  const fragmento = document.createDocumentFragment();

  productos.forEach((producto) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto';
    tarjeta.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}">
      <small class="categoria-producto">${producto.category}</small>
      <h3>${producto.title}</h3>
      <p>${producto.description}</p>
      <strong>$${Number(producto.price).toFixed(2)}</strong>
      <button type="button" class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
    `;
    fragmento.appendChild(tarjeta);
  });

  contenedorCatalogo.appendChild(fragmento);
}

// Configura las opciones de ordenamiento por título adicionales si no existen
function configurarOpcionesOrden() {
  const selectOrdenar = document.getElementById('ordenar');
  if (!selectOrdenar || selectOrdenar.querySelector('option[value="az"]')) return;

  const opcionAZ = document.createElement('option');
  opcionAZ.value = 'az';
  opcionAZ.textContent = 'Título: A - Z';

  const opcionZA = document.createElement('option');
  opcionZA.value = 'za';
  opcionZA.textContent = 'Título: Z - A';

  selectOrdenar.appendChild(opcionAZ);
  selectOrdenar.appendChild(opcionZA);
}

// Aplica en cadena búsqueda, filtro por categoría y ordenamiento con JavaScript
export function aplicarFiltros() {
  let resultado = [...listaProductos];

  // a) Búsqueda por texto en título o descripción
  const buscador = document.getElementById('buscador');
  const textoBuscador = buscador?.value.trim().toLowerCase() || '';
  if (textoBuscador) {
    resultado = resultado.filter((producto) =>
      producto.title.toLowerCase().includes(textoBuscador) ||
      producto.description.toLowerCase().includes(textoBuscador)
    );
  }

  // b) Filtro por categoría seleccionada
  const selectCategoria = document.getElementById('filtro-categoria');
  const categoria = selectCategoria?.value.toLowerCase() || '';
  if (categoria && categoria !== 'all' && categoria !== 'todas') {
    resultado = resultado.filter((producto) =>
      producto.category.toLowerCase() === categoria
    );
  }

  // c) Ordenamiento con .sort() por precio o título
  const selectOrdenar = document.getElementById('ordenar');
  const criterioOrden = selectOrdenar?.value || '';
  if (criterioOrden === 'precio-asc') {
    resultado.sort((a, b) => a.price - b.price);
  } else if (criterioOrden === 'precio-desc') {
    resultado.sort((a, b) => b.price - a.price);
  } else if (criterioOrden === 'az' || criterioOrden === 'titulo-asc') {
    resultado.sort((a, b) => a.title.localeCompare(b.title));
  } else if (criterioOrden === 'za' || criterioOrden === 'titulo-desc') {
    resultado.sort((a, b) => b.title.localeCompare(a.title));
  }

  renderizarProductos(resultado);
}

// Registra los eventos input y change sobre los controles de filtrado
function registrarEventosFiltros() {
  const buscador = document.getElementById('buscador');
  const filtroCategoria = document.getElementById('filtro-categoria');
  const selectOrdenar = document.getElementById('ordenar');

  buscador?.addEventListener('input', aplicarFiltros);
  filtroCategoria?.addEventListener('change', aplicarFiltros);
  selectOrdenar?.addEventListener('change', aplicarFiltros);
}

// Inicializa el catálogo, obtiene los datos de la API y registra los eventos
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
    configurarOpcionesOrden();
    renderizarProductos(listaProductos);
    registrarEventosFiltros();
  } catch (error) {
    if (mensajeEstado) {
      mensajeEstado.textContent = 'Hubo un error al cargar los productos. Intenta nuevamente más tarde.';
      mensajeEstado.hidden = false;
    }
  }
}
