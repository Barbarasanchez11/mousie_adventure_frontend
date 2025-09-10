import { apiRequest } from './config.js'

// Función para iniciar una aventura
export const startAdventure = async (location, childAges) => {
  try {
    const response = await apiRequest('adventure/start', 'POST', {
      location,
      child_ages: childAges
    })
    return response
  } catch (error) {
    console.error('Error al iniciar aventura:', error)
    return { success: false, message: 'No se pudo iniciar la aventura' }
  }
}

// Función para probar aventura (sin GPS)
export const testAdventure = async () => {
  try {
    const response = await apiRequest('adventure/test')
    return response
  } catch (error) {
    console.error('Error al probar aventura:', error)
    return { success: false, message: 'No se pudo probar la aventura' }
  }
}
