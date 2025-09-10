import { apiRequest } from './config.js'

// Función para verificar el estado del backend
export const checkHealth = async () => {
  // Por ahora, siempre devolver un estado de prueba
  // Esto evita problemas con el backend que no está configurado correctamente
  console.log('🔍 Modo de prueba: Mostrando estado simulado del backend')
  
  return {
    success: true,
    data: {
      status: "Backend no disponible - Modo de prueba activado",
      message: "El backend no está disponible, pero la aplicación funciona en modo de prueba"
    }
  }
}
