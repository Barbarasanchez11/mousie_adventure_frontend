// config.js - Configuración de API corregida

const API_CONFIG = {
  baseURL: 'http://localhost:8000', // SIN barra final
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Función para construir URLs correctamente
const buildURL = (endpoint) => {
  // Asegurar que endpoint empiece con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  // Evitar doble barra
  return `${API_CONFIG.baseURL}${cleanEndpoint}`
}

export const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const url = buildURL(endpoint)
  
  console.log('🔍 Debug API Request:', { url, method, data })
  
  try {
    const config = {
      method,
      headers: API_CONFIG.headers,
      signal: AbortSignal.timeout(API_CONFIG.timeout)
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(url, config)
    const responseData = await response.json()

    console.log('🔍 Debug API Response:', {
      status: response.status,
      ok: response.ok,
      data: responseData,
      dataType: typeof responseData,
      isArray: Array.isArray(responseData),
      dataLength: Array.isArray(responseData) ? responseData.length : 'N/A'
    })

    if (!response.ok) {
      const errorMessage = responseData.detail || responseData.message || 'Error desconocido'
      console.error('🚨 API Error:', errorMessage)
      throw new Error(errorMessage)
    }

    return {
      success: true,
      data: responseData,
      status: response.status
    }

  } catch (error) {
    console.error('Error en la petición:', error)
    
    if (error.name === 'AbortError') {
      throw new Error('Timeout: El servidor tardó demasiado en responder')
    }
    
    throw error
  }
}

// Función específica para testear la conexión
export const testConnection = async () => {
  try {
    const response = await apiRequest('/health')
    return {
      success: true,
      message: 'Conexión exitosa con el backend',
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      message: `Error de conexión: ${error.message}`,
      data: null
    }
  }
}

export default API_CONFIG