import { apiRequest } from './config.js'

// Función para crear una familia
export const createFamily = async (familyData) => {
  try {
    // Enviar datos de la familia al backend
    const response = await apiRequest('gamification/family/create', 'POST', familyData)
    
    return {
      success: true,
      data: response,
      message: 'Familia creada correctamente'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'No se pudo crear la familia'
    }
  }
}

// Función para obtener estadísticas de la familia
export const getFamilyStats = async (familyId) => {
  try {
    // Obtener estadísticas de la familia
    const response = await apiRequest(`gamification/family/${familyId}/stats`)
    
    return {
      success: true,
      data: response,
      message: 'Estadísticas obtenidas correctamente'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'No se pudieron obtener las estadísticas'
    }
  }
}

// Función para simular puntos ganados (para testing)
export const simulatePoints = () => {
  // Simular puntos ganados por completar aventura
  const points = Math.floor(Math.random() * 50) + 10 // 10-60 puntos
  const coins = Math.floor(Math.random() * 3) + 1 // 1-4 monedas
  
  return {
    points: points,
    coins: coins,
    message: `¡Ganaste ${points} puntos y ${coins} monedas!`
  }
}
