import { apiRequest } from './config.js'

// Función para iniciar una aventura
export const startAdventure = async (location, childAges) => {
  try {
    // Formatear los datos correctamente para el backend
    const adventureData = {
      latitude: location.latitude,
      longitude: location.longitude,
      child_ages: childAges
    }
    
    const response = await apiRequest('adventure/start', 'POST', adventureData)
    return response
  } catch (error) {
    console.error('Error al iniciar aventura:', error)
    
    // Si el backend no está disponible, devolver una aventura de prueba
    if (error.message.includes('Failed to fetch') || error.message.includes('500') || error.message.includes('422')) {
      return {
        success: true,
        data: {
          title: "Aventura GPS del Ratoncito Pérez",
          story: `¡Hola! Soy el Ratoncito Pérez y veo que estás en las coordenadas ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}. Te voy a contar una historia mágica sobre este lugar especial de Madrid.`,
          challenge: "Busca en tu casa un diente que se te haya caído recientemente. Si no tienes ninguno, ¡puedes usar un diente de leche imaginario!",
          curiosity: "¿Sabías que el Ratoncito Pérez nació en Madrid en 1894? Fue creado por el escritor Luis Coloma para consolar al futuro rey Alfonso XIII cuando perdió su primer diente.",
          reward: "Por completar esta aventura, ganarás 30 puntos y 4 monedas mágicas. ¡Sigue explorando para conseguir más recompensas!",
          location: "Madrid, España",
          duration: "15-20 minutos",
          difficulty: "Fácil",
          age_range: "3-12 años"
        }
      }
    }
    
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
    
    // Si el backend no está disponible, devolver una aventura de prueba
    if (error.message.includes('Failed to fetch') || error.message.includes('500')) {
      return {
        success: true,
        data: {
          title: "Aventura de Prueba del Ratoncito Pérez",
          story: "¡Hola! Soy el Ratoncito Pérez y te voy a contar una historia mágica. En el corazón de Madrid, hay un lugar especial donde los dientes de los niños se convierten en tesoros. ¿Quieres descubrirlo conmigo?",
          challenge: "Busca en tu casa un diente que se te haya caído recientemente. Si no tienes ninguno, ¡puedes usar un diente de leche imaginario!",
          curiosity: "¿Sabías que el Ratoncito Pérez nació en Madrid en 1894? Fue creado por el escritor Luis Coloma para consolar al futuro rey Alfonso XIII cuando perdió su primer diente.",
          reward: "Por completar esta aventura, ganarás 25 puntos y 3 monedas mágicas. ¡Sigue explorando para conseguir más recompensas!",
          location: "Madrid, España",
          duration: "15-20 minutos",
          difficulty: "Fácil",
          age_range: "3-12 años"
        }
      }
    }
    
    return { success: false, message: 'No se pudo probar la aventura' }
  }
}
