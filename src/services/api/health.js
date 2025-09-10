import { apiRequest } from './config.js'

// Función para verificar el estado del backend
export const checkHealth = async () => {
  try {
    const response = await apiRequest('health')
    return response
  } catch (error) {
    console.error('Error al verificar el estado del backend:', error)
    return { success: false, message: 'No se pudo conectar con el servidor' }
  }
}
