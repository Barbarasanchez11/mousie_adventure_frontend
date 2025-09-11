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

    // Debug: mostrar la respuesta completa
    console.log('🔍 Debug API Response:', {
      status: response.status,
      ok: response.ok,
      data: responseData,
      dataType: typeof responseData,
      isArray: Array.isArray(responseData),
      dataLength: Array.isArray(responseData) ? responseData.length : 'N/A'
    })

    // Si la respuesta no es OK (código 2xx), lanzamos un error
    if (!response.ok) {
      // Manejar diferentes tipos de errores del servidor
      let errorMessage = `Error del servidor: ${response.status}`
      
      // Si es un array de errores de validación (422)
      if (Array.isArray(responseData)) {
        errorMessage = responseData.map(err => {
          if (typeof err === 'string') {
            return err
          } else if (err && typeof err === 'object') {
            return `${err.field || 'Campo'}: ${err.message || err.msg || 'Error de validación'}`
          } else {
            return 'Error de validación'
          }
        }).join(', ')
      } else if (responseData.detail && Array.isArray(responseData.detail)) {
        // Si el error está dentro de un objeto con propiedad 'detail' (FastAPI)
        console.log('🔍 Debug Array de Errores:', responseData.detail)
        errorMessage = responseData.detail.map(err => {
          console.log('🔍 Debug Error Individual:', err)
          if (typeof err === 'string') {
            return err
          } else if (err && typeof err === 'object') {
            // Usar el campo 'loc' para mostrar el campo específico que falla
            const field = err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : 'Campo'
            return `${field}: ${err.msg || err.message || 'Error de validación'}`
          } else {
            return 'Error de validación'
          }
        }).join(', ')
      } else if (responseData.data && Array.isArray(responseData.data)) {
        // Si el error está dentro de un objeto con propiedad 'data'
        console.log('🔍 Debug Array de Errores:', responseData.data)
        errorMessage = responseData.data.map(err => {
          console.log('🔍 Debug Error Individual:', err)
          if (typeof err === 'string') {
            return err
          } else if (err && typeof err === 'object') {
            return `${err.field || 'Campo'}: ${err.message || err.msg || 'Error de validación'}`
          } else {
            return 'Error de validación'
          }
        }).join(', ')
      } else if (responseData.detail) {
        errorMessage = responseData.detail
      } else if (responseData.message) {
        errorMessage = responseData.message
      } else if (responseData.error) {
        errorMessage = responseData.error
      } else {
        // Si no podemos parsear el error, mostrar la respuesta completa
        errorMessage = `Error ${response.status}: ${JSON.stringify(responseData)}`
      }
      
      console.error('🚨 API Error:', errorMessage)
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
