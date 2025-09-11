import { apiRequest } from './config.js'


class StoryService {
  constructor() {
    this.baseURL = 'qa'
  }

  /**
   * Obtener una historia del Ratoncito Pérez para un lugar específico
   * @param {string} placeName -
   * @param {Array<number>} childrenAges 
   * @param {Object} coordinates 
   * @returns {Promise<Object>} 
   */
  async getStory(placeName, childrenAges = [6, 8], coordinates = null) {
    try {
      
      
      const requestData = {
        question: `Cuéntame una historia mágica sobre ${placeName}`,
        latitude: coordinates?.latitude || 40.4168,
        longitude: coordinates?.longitude || -3.7038,
        place_name: placeName,
        children_ages: childrenAges
      }

      const response = await apiRequest(`${this.baseURL}/ask`, 'POST', requestData)
      
      if (response.success) {
       
        return {
          success: true,
          data: {
            story: response.data.answer || 'Historia mágica del Ratoncito Pérez',
            place_name: placeName,
            children_ages: childrenAges,
            has_real_data: response.data.has_real_data || false,
            response_source: response.data.response_source || 'ai_generated',
            coordinates: coordinates
          }
        }
      } else {
        throw new Error(response.message || 'Error obteniendo historia')
      }
    } catch (error) {
      console.error('Error obteniendo historia:', error)
      return this.getFallbackStory(placeName, childrenAges)
    }
  }

  /**
   * Obtener una curiosidad sobre un lugar
   * @param {string} placeName 
   * @param {Array<number>} childrenAges 
   * @param {Object} coordinates 
   * @returns {Promise<Object>} 
   */
  async getCuriosity(placeName, childrenAges = [6, 8], coordinates = null) {
    try {
      
      const requestData = {
        question: `¿Qué curiosidad interesante tiene ${placeName}?`,
        latitude: coordinates?.latitude || 40.4168,
        longitude: coordinates?.longitude || -3.7038,
        place_name: placeName,
        children_ages: childrenAges
      }

      const response = await apiRequest(`${this.baseURL}/ask`, 'POST', requestData)
      
      if (response.success) {
      
        return {
          success: true,
          data: {
            curiosity: response.data.answer || 'Curiosidad mágica del lugar',
            place_name: placeName,
            children_ages: childrenAges,
            has_real_data: response.data.has_real_data || false,
            response_source: response.data.response_source || 'ai_generated'
          }
        }
      } else {
        throw new Error(response.message || 'Error obteniendo curiosidad')
      }
    } catch (error) {
      console.error('Error obteniendo curiosidad:', error)
      return this.getFallbackCuriosity(placeName, childrenAges)
    }
  }

  /**
   * Obtener un desafío para un lugar
   * @param {string} placeName - Nombre del lugar
   * @param {Array<number>} childrenAges - Edades de los niños
   * @param {Object} coordinates - Coordenadas del lugar
   * @returns {Promise<Object>} - Desafío generado
   */
  async getChallenge(placeName, childrenAges = [6, 8], coordinates = null) {
    try {
      
      const requestData = {
        question: `Crea un desafío corto y divertido para niños de ${childrenAges.join(' y ')} años en ${placeName}. Máximo 2-3 oraciones.`,
        latitude: coordinates?.latitude || 40.4168,
        longitude: coordinates?.longitude || -3.7038,
        place_name: placeName,
        children_ages: childrenAges
      }

      const response = await apiRequest(`${this.baseURL}/ask`, 'POST', requestData)
      
      if (response.success) {
      
        return {
          success: true,
          data: {
            challenge: this.truncateText(response.data.answer || 'Desafío mágico del Ratoncito Pérez'),
            place_name: placeName,
            children_ages: childrenAges,
            has_real_data: response.data.has_real_data || false,
            response_source: response.data.response_source || 'ai_generated'
          }
        }
      } else {
        throw new Error(response.message || 'Error obteniendo desafío')
      }
    } catch (error) {
      console.error('Error obteniendo desafío:', error)
      return this.getFallbackChallenge(placeName, childrenAges)
    }
  }

  /**
   * Obtener historia de fallback cuando el backend no está disponible
   * @param {string} placeName - Nombre del lugar
   * @param {Array<number>} childrenAges - Edades de los niños
   * @returns {Object} - Historia de fallback
   */
  getFallbackStory(placeName, childrenAges = [6, 8]) {
   
    
    const fallbackStories = {
      'Plaza Mayor': '¡Hola, familia! Soy el Ratoncito Pérez y te voy a contar un secreto sobre Plaza Mayor. Esta plaza mágica ha visto pasar siglos de historia. ¿Sabías que aquí se celebraban las fiestas más importantes de Madrid? ¡Y cada piedra tiene una historia que contar!',
      'Puerta del Sol': '¡Buenos días! Soy el Ratoncito Pérez. Puerta del Sol es el corazón de Madrid, donde todos los caminos se encuentran. Aquí está el kilómetro cero, el punto desde donde se miden todas las distancias de España. ¡Es un lugar lleno de magia y energía!',
      'Palacio Real': '¡Saludos, pequeños exploradores! Soy el Ratoncito Pérez. El Palacio Real es la residencia oficial de los reyes de España. ¿Sabías que tiene más de 3,000 habitaciones? ¡Y cada una guarda secretos y tesoros increíbles!',
      'Parque del Retiro': '¡Hola, aventureros! Soy el Ratoncito Pérez. El Retiro es mi parque favorito de Madrid. Aquí los árboles susurran historias antiguas y el estanque guarda secretos mágicos. ¡Es un lugar perfecto para soñar y jugar!',
      'Museo del Prado': '¡Buenos días, artistas! Soy el Ratoncito Pérez. El Prado es como una máquina del tiempo llena de arte. Aquí puedes viajar a través de la historia viendo cuadros increíbles. ¡Cada pintura tiene una historia mágica que contar!'
    }

    const story = fallbackStories[placeName] || `¡Hola, familia! Soy el Ratoncito Pérez y te voy a contar una historia mágica sobre ${placeName}. Este lugar especial está lleno de secretos y aventuras esperando ser descubiertos. ¡Vamos a explorarlo juntos!`

    return {
      success: true,
      data: {
        story: story,
        place_name: placeName,
        children_ages: childrenAges,
        has_real_data: false,
        response_source: 'fallback'
      }
    }
  }

  /**
   * Obtener curiosidad de fallback
   * @param {string} placeName - Nombre del lugar
   * @param {Array<number>} childrenAges - Edades de los niños
   * @returns {Object} - Curiosidad de fallback
   */
  getFallbackCuriosity(placeName, childrenAges = [6, 8]) {
    const curiosities = {
      'Plaza Mayor': '¿Sabías que Plaza Mayor tiene forma rectangular y está rodeada de edificios con balcones desde donde la gente observaba los espectáculos?',
      'Puerta del Sol': '¿Sabías que en Puerta del Sol está el reloj que marca las campanadas de fin de año para toda España?',
      'Palacio Real': '¿Sabías que el Palacio Real tiene una colección de violines Stradivarius, los instrumentos más valiosos del mundo?',
      'Parque del Retiro': '¿Sabías que el Retiro tiene un árbol que tiene más de 400 años y es uno de los más antiguos de Madrid?',
      'Museo del Prado': '¿Sabías que el Prado tiene más de 8,000 cuadros, pero solo se pueden ver unos 1,300 a la vez?'
    }

    const curiosity = curiosities[placeName] || `¿Sabías que ${placeName} tiene secretos mágicos esperando ser descubiertos?`

    return {
      success: true,
      data: {
        curiosity: curiosity,
        place_name: placeName,
        children_ages: childrenAges,
        has_real_data: false,
        response_source: 'fallback'
      }
    }
  }

  /**
   * Truncar texto si es muy largo
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima
   * @returns {string} - Texto truncado
   */
  truncateText(text, maxLength = 300) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  /**
   * Obtener desafío de fallback
   * @param {string} placeName - Nombre del lugar
   * @param {Array<number>} childrenAges - Edades de los niños
   * @returns {Object} - Desafío de fallback
   */
  getFallbackChallenge(placeName, childrenAges = [6, 8]) {
    const challenges = {
      'Plaza Mayor': 'Busca la estatua de Felipe III y cuenta cuántos dientes tiene el caballo. ¡Es un secreto que solo los más observadores pueden descubrir!',
      'Puerta del Sol': 'Encuentra el kilómetro cero y salta sobre él tres veces. ¡Cada salto te dará un deseo mágico!',
      'Palacio Real': 'Busca el escudo de armas en la fachada y cuenta cuántos elementos diferentes puedes identificar.',
      'Parque del Retiro': 'Encuentra el Palacio de Cristal y busca tu reflejo mágico en el agua.',
      'Museo del Prado': 'Busca un cuadro con un gato y cuéntame qué está haciendo ese gato mágico.'
    }

    const challenge = challenges[placeName] || `Explora ${placeName} y encuentra algo mágico que nadie más haya notado. ¡Tu misión es descubrir el secreto más especial del lugar!`

    return {
      success: true,
      data: {
        challenge: this.truncateText(challenge),
        place_name: placeName,
        children_ages: childrenAges,
        has_real_data: false,
        response_source: 'fallback'
      }
    }
  }
}

export const storyService = new StoryService()
