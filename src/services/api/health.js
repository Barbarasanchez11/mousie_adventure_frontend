import { apiRequest } from './config.js'

// Función para verificar el estado del backend
export const checkHealth = async () => {
  try {
    const response = await apiRequest('health')
    return response
  } catch (error) {
    console.error('Error al verificar el estado del backend:', error)
    
    // Si el backend no está disponible, devolver un estado de prueba
    if (error.message.includes('Failed to fetch') || error.message.includes('500') || error.message.includes('422')) {
      return {
        success: true,
        data: {
          status: "Backend no disponible - Modo de prueba activado",
          message: "El backend no está disponible, pero la aplicación funciona en modo de prueba"
        }
      }
    }
    
    return { success: false, message: 'No se pudo conectar con el servidor' }
  }
}
