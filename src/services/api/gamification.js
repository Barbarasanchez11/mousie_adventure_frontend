import { apiRequest } from './config.js'


export const createFamily = async (familyData) => {
  try {
  
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

export const getFamilyStats = async (familyId) => {
  try {
   
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

export const simulatePoints = () => {

  const points = Math.floor(Math.random() * 50) + 10 
  const coins = Math.floor(Math.random() * 3) + 1 
  
  return {
    points: points,
    coins: coins,
    message: `¡Ganaste ${points} puntos y ${coins} monedas!`
  }
}
