// Desarrollador A: Módulo de conexión y consumo con FakeStore API

const URL_API = 'https://fakestoreapi.com/products';

// Obtiene la lista completa de productos desde la API externa
export async function obtenerProductos() {
  try {
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) {
      throw new Error(`Error en la petición: ${respuesta.status}`);
    }
    const productos = await respuesta.json();
    return productos;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
}
