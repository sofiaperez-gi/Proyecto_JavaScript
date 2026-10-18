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

    if (items.length === 0) {
      const itemVacio = document.createElement('li');
      itemVacio.className = 'carrito-vacio';
      itemVacio.textContent = 'Tu carrito está vacío';
      listaCarrito.appendChild(itemVacio);
    } else {
      const fragmento = document.createDocumentFragment();

      items.forEach((item) => {
        const itemCarrito = document.createElement('li');
        itemCarrito.className = 'item-carrito';
        itemCarrito.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h4>${item.title}</h4>
        <p>$${Number(item.price).toFixed(2)}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <button type="button" class="btn-restar" data-accion="restar" data-id="${item.id}">-</button>
        <button type="button" class="btn-sumar" data-accion="sumar" data-id="${item.id}">+</button>
        <button type="button" class="btn-eliminar" data-accion="eliminar" data-id="${item.id}">Eliminar</button>
      `;
        fragmento.appendChild(itemCarrito);
      });

      listaCarrito.appendChild(fragmento);
    }
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

// Inicializa el carrito cargando datos de localStorage, renderizando y registrando eventos click
export function iniciarCarrito() {
  cargarDesdeStorage();
  renderizarCarrito();

  const btnCarrito = document.getElementById('btn-carrito');
  const btnCerrar = document.getElementById('btn-cerrar');
  const btnVaciar = document.getElementById('btn-vaciar');
  const carritoElemento = document.getElementById('carrito');
  const catalogoElemento = document.getElementById('catalogo');
  const listaCarrito = document.getElementById('lista-carrito');

  // a) Muestra el carrito cambiando la propiedad hidden a false
  btnCarrito?.addEventListener('click', () => {
    if (carritoElemento) {
      carritoElemento.hidden = false;
    }
  });

  // a) Oculta el carrito cambiando la propiedad hidden a true
  btnCerrar?.addEventListener('click', () => {
    if (carritoElemento) {
      carritoElemento.hidden = true;
    }
  });

  // b) Delegacion de eventos en #catalogo para agregar productos con btn-agregar
  catalogoElemento?.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-agregar')) {
      const id = e.target.dataset.id;
      if (id) {
        agregarAlCarrito(id);
      }
    }
  });

  // c) Delegacion de eventos en #lista-carrito usando data-id y data-accion
  listaCarrito?.addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;
    if (!id || !accion) return;

    if (accion === 'sumar') {
      cambiarCantidad(id, 1);
    } else if (accion === 'restar') {
      cambiarCantidad(id, -1);
    } else if (accion === 'eliminar') {
      eliminarDelCarrito(id);
    }
  });

  // d) Escucha el clic en #btn-vaciar y llama a vaciarCarrito
  btnVaciar?.addEventListener('click', () => {
    vaciarCarrito();
  });
}
