// Desarrollador B: Módulo de lógica, persistencia y renderizado del carrito

import { obtenerProductoPorId } from './catalogo.js';

// Estado global del carrito indexado por ID
export let carrito = {};

// Recupera el carrito desde localStorage al iniciar la aplicacion
export function cargarDesdeStorage() {
  try {
    const guardado = localStorage.getItem('carrito_fakestore');
    carrito = guardado ? JSON.parse(guardado) : {};
  } catch {
    carrito = {};
  }
  return carrito;
}

// Persiste el estado del carrito en localStorage
export function guardarEnStorage() {
  try {
    localStorage.setItem('carrito_fakestore', JSON.stringify(carrito));
  } catch {
    // Continuar si localStorage no esta disponible
  }
}

// Agrega un producto al carrito o incrementa su cantidad
export function agregarAlCarrito(id) {
  if (carrito[id]) {
    carrito[id].cantidad += 1;
  } else {
    const producto = obtenerProductoPorId(id);
    if (producto) {
      carrito[id] = {
        id: producto.id,
        title: producto.title,
        price: producto.price,
        image: producto.image,
        cantidad: 1
      };
    }
  }
  guardarEnStorage();
  renderizarCarrito();
}

// Modifica la cantidad de un producto o lo elimina si llega a 0
export function cambiarCantidad(id, cambio) {
  if (!carrito[id]) return;

  carrito[id].cantidad += Number(cambio);
  if (carrito[id].cantidad <= 0) {
    delete carrito[id];
  }

  guardarEnStorage();
  renderizarCarrito();
}

// Elimina un producto especifico del carrito
export function eliminarDelCarrito(id) {
  delete carrito[id];
  guardarEnStorage();
  renderizarCarrito();
}

// Reinicia el carrito a un objeto vacio
export function vaciarCarrito() {
  carrito = {};
  guardarEnStorage();
  renderizarCarrito();
}

// Renderiza dinamicamente los productos del carrito en el DOM
export function renderizarCarrito() {
  const listaCarrito = document.getElementById('lista-carrito');
  const items = Object.values(carrito);

  if (listaCarrito) {
    listaCarrito.innerHTML = '';
    const fragmento = document.createDocumentFragment();

    items.forEach((item) => {
      const articulo = document.createElement('article');
      articulo.className = 'item-carrito';
      articulo.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h4>${item.title}</h4>
        <p>$${Number(item.price).toFixed(2)}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <button type="button" class="btn-restar" data-accion="restar" data-id="${item.id}">-</button>
        <button type="button" class="btn-sumar" data-accion="sumar" data-id="${item.id}">+</button>
        <button type="button" class="btn-eliminar" data-accion="eliminar" data-id="${item.id}">Eliminar</button>
      `;
      fragmento.appendChild(articulo);
    });

    listaCarrito.appendChild(fragmento);
  }

  const totalPrecio = items.reduce((acumulado, item) => acumulado + Number(item.price) * item.cantidad, 0);
  const totalUnidades = items.reduce((acumulado, item) => acumulado + item.cantidad, 0);

  const totalElemento = document.getElementById('total-carrito');
  if (totalElemento) {
    totalElemento.textContent = totalPrecio.toFixed(2);
  }

  const contadorElemento = document.getElementById('contador-carrito');
  if (contadorElemento) {
    contadorElemento.textContent = totalUnidades;
  }
}

// Configura los escuchadores de eventos para interactuar con el carrito
function configurarEventos() {
  const btnCarrito = document.getElementById('btn-carrito');
  const btnCerrar = document.getElementById('btn-cerrar');
  const btnVaciar = document.getElementById('btn-vaciar');
  const asideCarrito = document.getElementById('carrito');
  const listaCarrito = document.getElementById('lista-carrito');

  // Abre el panel lateral del carrito
  btnCarrito?.addEventListener('click', () => {
    if (asideCarrito) asideCarrito.hidden = false;
  });

  // Cierra el panel lateral del carrito
  btnCerrar?.addEventListener('click', () => {
    if (asideCarrito) asideCarrito.hidden = true;
  });

  // Vacia todos los productos del carrito
  btnVaciar?.addEventListener('click', () => {
    vaciarCarrito();
  });

  // Maneja cambios de cantidad y eliminacion mediante delegacion de eventos
  listaCarrito?.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button');
    if (!boton) return;

    const id = boton.dataset.id;
    if (!id) return;

    if (boton.dataset.accion === 'sumar' || boton.classList.contains('btn-sumar')) {
      cambiarCantidad(id, 1);
    } else if (boton.dataset.accion === 'restar' || boton.classList.contains('btn-restar')) {
      cambiarCantidad(id, -1);
    } else if (boton.dataset.accion === 'eliminar' || boton.classList.contains('btn-eliminar')) {
      eliminarDelCarrito(id);
    }
  });

  // Delegacion de eventos para agregar productos desde el catalogo
  document.addEventListener('click', (evento) => {
    const btnAgregar = evento.target.closest('.btn-agregar');
    if (btnAgregar && btnAgregar.dataset.id) {
      agregarAlCarrito(btnAgregar.dataset.id);
    }
  });
}

// Inicializa el carrito cargando datos previos y registrando eventos
export function iniciarCarrito() {
  cargarDesdeStorage();
  renderizarCarrito();
  configurarEventos();
}
