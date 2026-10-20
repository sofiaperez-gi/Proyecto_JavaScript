// Módulo del Catálogo: Búsqueda, filtros, orden y visualización de productos
import { obtenerProductos } from './api.js';

// Memoria local donde guardamos los productos traídos de la tienda
let listaProductos = [];

// Busca y devuelve un producto por su ID
export function obtenerProductoPorId(id) {
  return listaProductos.find((producto) => producto.id === Number(id));
}

// Llena el selector de categorías automáticamente sin repetir nombres
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

// Controla la animación para mostrar las tarjetas suavemente al bajar con el scroll
let observadorTarjetas = null;

function configurarObservadorScroll(tarjetas) {
  if (observadorTarjetas) {
    observadorTarjetas.disconnect();
  }

  // Si el navegador no soporta el observador, muestra las tarjetas directamente
  if (!('IntersectionObserver' in window)) {
    tarjetas.forEach((tarjeta) => tarjeta.classList.add('visible'));
    return;
  }

  observadorTarjetas = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  tarjetas.forEach((tarjeta) => observadorTarjetas.observe(tarjeta));
}

// Dibuja todas las tarjetas de productos en la página
export function renderizarProductos(productos) {
  const contenedorCatalogo = document.getElementById('catalogo');
  if (!contenedorCatalogo) return;

  const mensajeEstado = document.getElementById('mensaje-estado');
  contenedorCatalogo.innerHTML = '';
  if (mensajeEstado) {
    contenedorCatalogo.appendChild(mensajeEstado);
  }

  // Aviso si no hay resultados para la búsqueda
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

  // Crea cada tarjeta con su información y botón de compra
  const fragmento = document.createDocumentFragment();

  productos.forEach((producto, index) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto';
    tarjeta.style.setProperty('--orden', index);
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

  // Activa la animación de entrada para las tarjetas recién creadas
  const tarjetas = contenedorCatalogo.querySelectorAll('.tarjeta-producto');
  configurarObservadorScroll(tarjetas);
}

// Agrega las opciones de orden alfabético al menú desplegable si no existen
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

// Aplica al mismo tiempo la búsqueda por texto, filtro de categoría y ordenamiento
export function aplicarFiltros() {
  let resultado = [...listaProductos];

  // 1. Filtra por lo que el usuario escribió en el buscador
  const buscador = document.getElementById('buscador');
  const textoBuscador = buscador?.value.trim().toLowerCase() || '';
  if (textoBuscador) {
    resultado = resultado.filter((producto) =>
      producto.title.toLowerCase().includes(textoBuscador) ||
      producto.description.toLowerCase().includes(textoBuscador)
    );
  }

  // 2. Filtra por la categoría seleccionada
  const selectCategoria = document.getElementById('filtro-categoria');
  const categoria = selectCategoria?.value.toLowerCase() || '';
  if (categoria && categoria !== 'all' && categoria !== 'todas') {
    resultado = resultado.filter((producto) =>
      producto.category.toLowerCase() === categoria
    );
  }

  // 3. Ordena los productos por precio o por nombre
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

// Escucha cuando el usuario escribe en el buscador o cambia los menús
function registrarEventosFiltros() {
  const buscador = document.getElementById('buscador');
  const filtroCategoria = document.getElementById('filtro-categoria');
  const selectOrdenar = document.getElementById('ordenar');

  buscador?.addEventListener('input', aplicarFiltros);
  filtroCategoria?.addEventListener('change', aplicarFiltros);
  selectOrdenar?.addEventListener('change', aplicarFiltros);
}

// Cambia el botón a "✓ Agregado" por un momento al hacer clic para dar confirmación visual
let feedbackAgregarRegistrado = false;

function registrarFeedbackAgregar() {
  if (feedbackAgregarRegistrado) return;
  const contenedorCatalogo = document.getElementById('catalogo');
  if (!contenedorCatalogo) return;

  contenedorCatalogo.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-agregar');
    if (!boton) return;

    boton.textContent = '✓ Agregado';
    boton.classList.add('agregado');

    if (boton._timerFeedback) {
      clearTimeout(boton._timerFeedback);
    }

    boton._timerFeedback = setTimeout(() => {
      boton.textContent = 'Agregar al carrito';
      boton.classList.remove('agregado');
      boton._timerFeedback = null;
    }, 700);
  });

  feedbackAgregarRegistrado = true;
}

// Función principal: pide los productos a la API y enciende el catálogo
export async function iniciarCatalogo() {
  const mensajeEstado = document.getElementById('mensaje-estado');

  try {
    if (mensajeEstado) {
      mensajeEstado.textContent = 'Cargando productos...';
      mensajeEstado.hidden = false;
    }

    // Trae los datos de la tienda desde el servidor externo
    listaProductos = await obtenerProductos();

    if (mensajeEstado) {
      mensajeEstado.hidden = true;
    }

    cargarCategorias(listaProductos);
    configurarOpcionesOrden();
    renderizarProductos(listaProductos);
    registrarEventosFiltros();
    registrarFeedbackAgregar();
  } catch (error) {
    if (mensajeEstado) {
      mensajeEstado.textContent = 'Hubo un error al cargar los productos. Intenta nuevamente más tarde.';
      mensajeEstado.hidden = false;
    }
  }
}

// SECCIÓN: MODAL Y CARRUSEL DE PRODUCTOS (ABRE AL CLIC EN PRODUCTO)
import { agregarAlCarrito } from './carrito.js';

let indiceCarrusel = 0;
let productosCarrusel = [];

// Mueve el carrusel hacia un índice específico
export function moverCarruselA(indice) {
  const pista = document.getElementById('carrusel-pista');
  if (!pista || !productosCarrusel.length) return;
  indiceCarrusel = Math.max(0, Math.min(indice, productosCarrusel.length - 1));
  pista.style.transform = `translateX(-${indiceCarrusel * 100}%)`;
  const ind = document.getElementById('carrusel-indicador');
  if (ind) ind.textContent = `${indiceCarrusel + 1} / ${productosCarrusel.length}`;
  document.getElementById('carrusel')?.focus();
}

export const abrirCarruselEn = (i) => {
  const m = document.getElementById('modal-carrusel');
  if (m) { m.hidden = false; moverCarruselA(i); }
};

export const cerrarCarrusel = () => {
  const m = document.getElementById('modal-carrusel');
  if (m) m.hidden = true;
};

// Inicializa el carrusel y sus eventos
export function iniciarCarrusel(productos) {
  const modal = document.getElementById('modal-carrusel');
  const pista = document.getElementById('carrusel-pista');
  const carrusel = document.getElementById('carrusel');
  if (!carrusel || !pista) return;

  productosCarrusel = (productos?.length) ? productos : listaProductos;
  if (!productosCarrusel?.length) return;

  pista.innerHTML = productosCarrusel.map((p, i) => `
    <article class="tarjeta-producto carrusel-item" data-index="${i}">
      <img src="${p.image}" alt="${p.title}">
      <small class="categoria-producto">${p.category}</small>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <strong>$${Number(p.price).toFixed(2)}</strong>
      <button type="button" class="btn-agregar" data-id="${p.id}">Agregar al carrito</button>
    </article>`).join('');

  // Clic en tarjeta del catálogo: abre el carrusel
  document.getElementById('catalogo')?.addEventListener('click', (e) => {
    if (e.target.closest('.btn-agregar')) return;
    const id = e.target.closest('.tarjeta-producto')?.querySelector('.btn-agregar')?.dataset.id;
    const pos = productosCarrusel.findIndex((p) => p.id === Number(id));
    if (pos !== -1) abrirCarruselEn(pos);
  });

  // Navegación por teclado
  carrusel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); moverCarruselA(indiceCarrusel + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); moverCarruselA(indiceCarrusel - 1); }
    if (e.key === 'Escape') cerrarCarrusel();
  });

  // Controles del modal
  document.getElementById('carrusel-prev')?.addEventListener('click', () => moverCarruselA(indiceCarrusel - 1));
  document.getElementById('carrusel-next')?.addEventListener('click', () => moverCarruselA(indiceCarrusel + 1));
  document.getElementById('btn-cerrar-carrusel')?.addEventListener('click', cerrarCarrusel);
  document.getElementById('modal-carrusel-fondo')?.addEventListener('click', cerrarCarrusel);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && !modal.hidden) cerrarCarrusel(); });

  // Agregar al carrito desde el carrusel
  pista.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-agregar');
    if (!btn?.dataset.id) return;
    agregarAlCarrito(btn.dataset.id);
    btn.textContent = '✓ Agregado';
    btn.classList.add('agregado');
    setTimeout(() => { btn.textContent = 'Agregar al carrito'; btn.classList.remove('agregado'); }, 700);
  });
}