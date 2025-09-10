// src/services/api/config.js

// URL base de nuestra API, se obtiene de las variables de entorno de Vite
// Por ejemplo: http://localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'

/**
 * Función genérica para hacer peticiones a la API.
 * @param {string} endpoint - La parte final de la URL de la API (ej: '/health', '/adventure/start').
 * @param {string} method - El método HTTP (ej: 'GET', 'POST').
 * @param {Object} [data] - Los datos a enviar en el cuerpo de la petición (para POST/PUT).
 * @returns {Promise<Object>} - Una promesa que resuelve con la respuesta de la API.
 */
export const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_BASE_URL}/${endpoint}` // Construye la URL completa
  const headers = {
    'Content-Type': 'application/json', // Siempre enviamos JSON
  }

  const config = {
    method,
    headers,
  }

  // Si hay datos, los añadimos al cuerpo de la petición
  if (data) {
    config.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, config) // Hace la petición
    const responseData = await response.json() // Convierte la respuesta a JSON

    // Si la respuesta no es OK (código 2xx), lanzamos un error
    if (!response.ok) {
      // Manejar diferentes tipos de errores del servidor
      let errorMessage = `Error del servidor: ${response.status}`
      
      if (responseData.detail) {
        errorMessage = responseData.detail
      } else if (responseData.message) {
        errorMessage = responseData.message
      } else if (responseData.error) {
        errorMessage = responseData.error
      }
      
      throw new Error(errorMessage)
    }

    // Si todo va bien, devolvemos los datos
    return { success: true, data: responseData }
  } catch (error) {
    // Capturamos cualquier error de red o del servidor
    console.error('Error en la petición:', error)
    throw error // Lanzar el error para que sea capturado por el catch de las funciones que llaman a apiRequest
  }
}
