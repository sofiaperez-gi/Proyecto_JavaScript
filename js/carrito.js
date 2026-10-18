// Módulo del Carrito: Lógica de compras, cantidades, totales y almacenamiento local
import { obtenerProductoPorId } from './catalogo.js';

// Estado global donde se guardan los productos seleccionados (indexados por ID)
export let carrito = {};

// Carga los productos guardados en el navegador para no perderlos si se recarga la página
export function cargarDesdeStorage() {
  try {
    const guardado = localStorage.getItem('carrito_fakestore');
    carrito = guardado ? JSON.parse(guardado) : {};
  } catch {
    carrito = {};
  }
  return carrito;
}

// Guarda el carrito en la memoria del navegador (localStorage)
export function guardarEnStorage() {
  try {
    localStorage.setItem('carrito_fakestore', JSON.stringify(carrito));
  } catch {
    // Continúa normalmente si el almacenamiento local está restringido
  }
}

// Agrega un producto al carrito o aumenta en 1 su cantidad si ya existía
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

// Suma o resta unidades de un producto y lo elimina si la cantidad llega a cero
export function cambiarCantidad(id, cambio) {
  if (!carrito[id]) return;

  carrito[id].cantidad += Number(cambio);
  if (carrito[id].cantidad <= 0) {
    delete carrito[id];
  }

  guardarEnStorage();
  renderizarCarrito();
}

// Quita por completo un producto del carrito
export function eliminarDelCarrito(id) {
  delete carrito[id];
  guardarEnStorage();
  renderizarCarrito();
}

// Vacía todos los artículos del carrito de una sola vez
export function vaciarCarrito() {
  carrito = {};
  guardarEnStorage();
  renderizarCarrito();
}

// Dibuja los productos en el panel, actualiza el contador y calcula el total a pagar
export function renderizarCarrito() {
  const listaCarrito = document.getElementById('lista-carrito');
  const items = Object.values(carrito);

  if (listaCarrito) {
    listaCarrito.innerHTML = '';

    // Muestra aviso si el carrito no tiene artículos
    if (items.length === 0) {
      const itemVacio = document.createElement('li');
      itemVacio.className = 'carrito-vacio';
      itemVacio.textContent = 'Tu carrito está vacío';
      listaCarrito.appendChild(itemVacio);
    } else {
      // Dibuja cada producto en el carrito con sus botones para sumar, restar y eliminar
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

  // Calcula la suma total del dinero y la cantidad total de artículos
  const totalPrecio = items.reduce((acumulado, item) => acumulado + Number(item.price) * item.cantidad, 0);
  const totalUnidades = items.reduce((acumulado, item) => acumulado + item.cantidad, 0);

  // Muestra el precio final en pantalla
  const totalElemento = document.getElementById('total-carrito');
  if (totalElemento) {
    totalElemento.textContent = totalPrecio.toFixed(2);
  }

  // Muestra el número en el botón del encabezado
  const contadorElemento = document.getElementById('contador-carrito');
  if (contadorElemento) {
    contadorElemento.textContent = totalUnidades;
  }
}

// Función principal: recupera datos guardados, dibuja el carrito y activa los botones
export function iniciarCarrito() {
  cargarDesdeStorage();
  renderizarCarrito();

  const btnCarrito = document.getElementById('btn-carrito');
  const btnCerrar = document.getElementById('btn-cerrar');
  const btnVaciar = document.getElementById('btn-vaciar');
  const carritoElemento = document.getElementById('carrito');
  const catalogoElemento = document.getElementById('catalogo');
  const listaCarrito = document.getElementById('lista-carrito');

  // Abre el panel lateral del carrito
  btnCarrito?.addEventListener('click', () => {
    if (carritoElemento) {
      carritoElemento.hidden = false;
    }
  });

  // Cierra el panel lateral del carrito
  btnCerrar?.addEventListener('click', () => {
    if (carritoElemento) {
      carritoElemento.hidden = true;
    }
  });

  // Escucha los clics en "Agregar al carrito" dentro de las tarjetas del catálogo
  catalogoElemento?.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-agregar')) {
      const id = e.target.dataset.id;
      if (id) {
        agregarAlCarrito(id);
      }
    }
  });

  // Controla los botones de sumar (+), restar (-) y eliminar dentro de la lista
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

  // Vacía el carrito por completo al presionar el botón rojo
  btnVaciar?.addEventListener('click', () => {
    vaciarCarrito();
  });
}
