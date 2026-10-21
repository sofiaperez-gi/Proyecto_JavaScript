// Módulo del Carrito: estado, almacenamiento, vistas y compras
import { obtenerProductoPorId } from './catalogo.js';

export let carrito = {};
const guardar = () => localStorage.setItem('carrito_fakestore', JSON.stringify(carrito));

// Carga inicial y persistencia
export const cargarDesdeStorage = () => {
  try { carrito = JSON.parse(localStorage.getItem('carrito_fakestore')) || {}; } catch { carrito = {}; }
  return carrito;
};
export const guardarEnStorage = guardar;

// Modificación de artículos del carrito
export function agregarAlCarrito(id) {
  if (carrito[id]) carrito[id].cantidad += 1;
  else {
    const p = obtenerProductoPorId(id);
    if (!p) return;
    carrito[id] = { id: p.id, title: p.title, price: p.price, image: p.image, cantidad: 1 };
  }
  guardar();
  renderizarCarrito();
}

export function cambiarCantidad(id, delta) {
  if (!carrito[id]) return;
  carrito[id].cantidad += Number(delta);
  if (carrito[id].cantidad <= 0) delete carrito[id];
  guardar();
  renderizarCarrito();
}

export function eliminarDelCarrito(id) {
  delete carrito[id];
  guardar();
  renderizarCarrito();
}

export function vaciarCarrito() {
  carrito = {};
  guardar();
  renderizarCarrito();
}

// Actualiza lista, total y contador del carrito
export function renderizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const items = Object.values(carrito);
  if (!lista) return;

  lista.innerHTML = items.length === 0
    ? '<li class="carrito-vacio">Tu carrito está vacío</li>'
    : items.map(i => `
      <li class="item-carrito">
        <img src="${i.image}" alt="${i.title}">
        <h4>${i.title}</h4>
        <p>$${Number(i.price).toFixed(2)}</p>
        <p>Cant: ${i.cantidad}</p>
        <button type="button" class="btn-restar" data-accion="restar" data-id="${i.id}">-</button>
        <button type="button" class="btn-sumar" data-accion="sumar" data-id="${i.id}">+</button>
        <button type="button" class="btn-eliminar" data-accion="eliminar" data-id="${i.id}">✕</button>
      </li>`).join('');

  const total = items.reduce((acc, i) => acc + Number(i.price) * i.cantidad, 0);
  const unidades = items.reduce((acc, i) => acc + i.cantidad, 0);
  const totalEl = document.getElementById('total-carrito');
  if (totalEl) totalEl.textContent = total.toFixed(2);
  const contadorEl = document.getElementById('contador-carrito');
  if (contadorEl) contadorEl.textContent = unidades;
}

// Conmuta entre vistas: 'carrito', 'checkout', 'historial'
export function cambiarVistaCarrito(vista) {
  ['carrito', 'checkout', 'historial'].forEach(v => {
    const sec = document.getElementById(`vista-${v}`);
    if (sec) sec.hidden = (v !== vista);
  });
  if (vista === 'historial') renderizarHistorial();
}

// Renderiza compras previas desde localStorage
export function renderizarHistorial() {
  const lista = document.getElementById('lista-historial');
  if (!lista) return;
  const historial = JSON.parse(localStorage.getItem('historial_compras') || '[]');

  lista.innerHTML = historial.length === 0
    ? '<li class="historial-vacio">No hay compras registradas</li>'
    : [...historial].reverse().map(c => `
      <li class="item-historial">
        <div class="historial-header"><strong>${c.id}</strong><small>${c.fecha}</small></div>
        <p><strong>Comprador:</strong> ${c.cliente?.nombre || 'Anónimo'} (${c.cliente?.email || 'N/A'})</p>
        <p><strong>Envío:</strong> ${c.cliente?.direccion || 'N/A'}</p>
        <ul class="historial-productos">${c.productos.map(p => `<li>${p.cantidad}x ${p.title} ($${Number(p.price).toFixed(2)})</li>`).join('')}</ul>
        <div class="historial-total">Total: $${Number(c.total).toFixed(2)}</div>
      </li>`).join('');
}

// Guarda la compra en historial y vacía el carrito
export function simularCompra(datos = {}) {
  const items = Object.values(carrito);
  if (items.length === 0) return;

  const historial = JSON.parse(localStorage.getItem('historial_compras') || '[]');
  historial.push({
    id: 'COMPRA-' + Date.now(),
    fecha: new Date().toLocaleString(),
    cliente: datos,
    productos: items,
    total: Number(items.reduce((acc, i) => acc + Number(i.price) * i.cantidad, 0).toFixed(2))
  });

  localStorage.setItem('historial_compras', JSON.stringify(historial));
  localStorage.removeItem('carrito');
  localStorage.removeItem('carrito_fakestore');
  carrito = {};

  renderizarCarrito();
  cambiarVistaCarrito('historial');
  const exito = document.getElementById('mensaje-historial-exito');
  if (exito) { exito.hidden = false; setTimeout(() => { exito.hidden = true; }, 3500); }
}

// Eventos e inicialización del panel lateral
export function iniciarCarrito() {
  cargarDesdeStorage();
  renderizarCarrito();
  const aside = document.getElementById('carrito');

  document.getElementById('btn-carrito')?.addEventListener('click', () => { aside.hidden = false; cambiarVistaCarrito('carrito'); });
  document.getElementById('btn-historial-header')?.addEventListener('click', () => { aside.hidden = false; cambiarVistaCarrito('historial'); });
  document.getElementById('btn-cerrar')?.addEventListener('click', () => { aside.hidden = true; });

  document.getElementById('catalogo')?.addEventListener('click', e => {
    if (e.target.classList.contains('btn-agregar')) agregarAlCarrito(e.target.dataset.id);
  });

  document.getElementById('lista-carrito')?.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn?.dataset.id || !btn.dataset.accion) return;
    const { id, accion } = btn.dataset;
    if (accion === 'sumar') cambiarCantidad(id, 1);
    if (accion === 'restar') cambiarCantidad(id, -1);
    if (accion === 'eliminar') eliminarDelCarrito(id);
  });

  document.getElementById('btn-vaciar')?.addEventListener('click', vaciarCarrito);

  document.getElementById('btn-iniciar-compra')?.addEventListener('click', () => {
    const items = Object.values(carrito);
    const aviso = document.getElementById('mensaje-carrito');
    if (items.length === 0) {
      if (aviso) { aviso.textContent = 'El carrito está vacío'; aviso.className = 'mensaje-compra error'; aviso.hidden = false; setTimeout(() => { aviso.hidden = true; }, 2500); }
      return;
    }
    document.getElementById('checkout-total-valor').textContent = items.reduce((acc, i) => acc + Number(i.price) * i.cantidad, 0).toFixed(2);
    cambiarVistaCarrito('checkout');
  });

  document.getElementById('btn-ver-historial')?.addEventListener('click', () => cambiarVistaCarrito('historial'));
  document.getElementById('btn-cancelar-checkout')?.addEventListener('click', () => cambiarVistaCarrito('carrito'));
  document.getElementById('btn-volver-carrito')?.addEventListener('click', () => cambiarVistaCarrito('carrito'));

  document.getElementById('btn-limpiar-historial')?.addEventListener('click', () => {
    if (confirm('¿Vaciar historial?')) { localStorage.removeItem('historial_compras'); renderizarHistorial(); }
  });

  document.getElementById('form-compra')?.addEventListener('submit', e => {
    e.preventDefault();
    simularCompra({
      nombre: document.getElementById('compra-nombre')?.value.trim(),
      email: document.getElementById('compra-email')?.value.trim(),
      direccion: document.getElementById('compra-direccion')?.value.trim()
    });
    e.target.reset();
  });
}