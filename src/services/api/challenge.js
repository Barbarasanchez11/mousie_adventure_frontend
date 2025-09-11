import { apiRequest } from './config.js'

/**
 * Servicio para manejar desafíos del Ratoncito Pérez
 * Se conecta con el backend para obtener desafíos generados por IA
 */
class ChallengeService {
  constructor() {
    this.baseURL = 'adventure'
  }

  /**
   * Generar un desafío para un lugar específico
   * @param {string} placeName - Nombre del lugar
   * @param {Array<number>} childrenAges - Edades de los niños
   * @param {Object} placeData - Datos del lugar (opcional)
   * @returns {Promise<Object>} - Desafío generado
   */
  async generateChallenge(placeName, childrenAges = [6, 8], placeData = null) {
    try {
      console.log(`🎯 Generando desafío para ${placeName} con edades ${childrenAges}`)
      
      // Primero intentar con el endpoint de aventura
      try {
        const requestData = {
          latitude: placeData?.latitude || 40.4168,
          longitude: placeData?.longitude || -3.7038,
          children_ages: childrenAges
        }

        const response = await apiRequest('adventure/start', 'POST', requestData)
        
        if (response.success) {
          console.log(`✅ Desafío generado desde adventure/start para ${placeName}:`, response.data)
          return {
            success: true,
            data: {
              challenge: response.data.challenge || 'Desafío mágico del Ratoncito Pérez',
              place_name: placeName,
              children_ages: childrenAges,
              has_real_data: response.data.has_real_data || false,
              challenge_source: 'adventure_api',
              difficulty: this.calculateDifficulty(childrenAges),
              estimated_time: this.calculateEstimatedTime(childrenAges),
              rewards: this.generateRewards(placeName),
              story: response.data.story || '',
              curiosity: response.data.curiosity || '',
              reward: response.data.reward || '',
              next_place: response.data.next_place || '',
              business_offer: response.data.business_offer || ''
            }
          }
        }
      } catch (adventureError) {
        console.log('⚠️ Adventure/start falló, intentando con test endpoint')
      }

      // Si falla, usar el endpoint de test
      const testResponse = await apiRequest('adventure/test', 'GET')
      
      if (testResponse.success) {
        console.log(`✅ Desafío generado desde adventure/test para ${placeName}:`, testResponse.data)
        return {
          success: true,
            data: {
              challenge: testResponse.data.challenge || 'Desafío mágico del Ratoncito Pérez',
              place_name: placeName,
              children_ages: childrenAges,
              has_real_data: false,
              challenge_source: 'test_api',
              difficulty: this.calculateDifficulty(childrenAges),
              estimated_time: this.calculateEstimatedTime(childrenAges),
              rewards: this.generateRewards(placeName),
              story: testResponse.data.story || '',
              curiosity: testResponse.data.curiosity || '',
              reward: testResponse.data.reward || '',
              next_place: testResponse.data.next_place || '',
              business_offer: testResponse.data.business_offer || ''
            }
        }
      } else {
        throw new Error(testResponse.message || 'Error generando desafío')
      }
    } catch (error) {
      console.error('Error generando desafío:', error)
      return this.getFallbackChallenge(placeName, childrenAges)
    }
  }

  /**
   * Obtener desafíos predefinidos para un lugar
   * @param {string} placeName - Nombre del lugar
   * @returns {Promise<Object>} - Lista de desafíos
   */
  async getPredefinedChallenges(placeName) {
    try {
      const response = await apiRequest(`${this.baseURL}/challenge/predefined?place=${encodeURIComponent(placeName)}`, 'GET')
      
      if (response.success) {
        return {
          success: true,
          data: response.data.challenges || []
        }
      } else {
        throw new Error(response.message || 'Error obteniendo desafíos predefinidos')
      }
    } catch (error) {
      console.error('Error obteniendo desafíos predefinidos:', error)
      return {
        success: false,
        data: []
      }
    }
  }

  /**
   * Validar si un desafío fue completado
   * @param {string} placeName - Nombre del lugar
   * @param {string} challenge - Desafío completado
   * @param {Object} userAnswer - Respuesta del usuario
   * @param {string} familyId - ID de la familia (opcional)
   * @returns {Promise<Object>} - Resultado de la validación
   */
  async validateChallenge(placeName, challenge, userAnswer, familyId = 'default-family') {
    try {
      // Registrar la visita al lugar en gamificación
      if (familyId) {
        await this.recordPlaceVisit(familyId, placeName)
      }

      // Simular validación (en un sistema real, esto se haría con IA)
      const isCorrect = this.simulateChallengeValidation(placeName, challenge, userAnswer)
      
      if (isCorrect && familyId) {
        // Registrar desafío completado en gamificación
        await this.recordChallengeCompletion(familyId)
      }

      return {
        success: true,
        data: {
          is_correct: isCorrect,
          score: isCorrect ? this.calculateScore(placeName, challenge) : 0,
          feedback: isCorrect ? '¡Excelente! Has completado el desafío' : '¡Buen intento! Sigue explorando',
          rewards: isCorrect ? this.generateRewards(placeName) : []
        }
      }
    } catch (error) {
      console.error('Error validando desafío:', error)
      return {
        success: false,
        data: {
          is_correct: false,
          score: 0,
          feedback: 'Error validando el desafío',
          rewards: []
        }
      }
    }
  }

  /**
   * Simular validación de desafío (en un sistema real, esto se haría con IA)
   * @param {string} placeName - Nombre del lugar
   * @param {string} challenge - Desafío completado
   * @param {Object} userAnswer - Respuesta del usuario
   * @returns {boolean} - Si la respuesta es correcta
   */
  simulateChallengeValidation(placeName, challenge, userAnswer) {
    // Simulación simple: si la respuesta tiene más de 10 caracteres, es correcta
    const answerText = userAnswer.answer || userAnswer.toString()
    return answerText.length > 10
  }

  /**
   * Calcular puntuación del desafío
   * @param {string} placeName - Nombre del lugar
   * @param {string} challenge - Desafío completado
   * @returns {number} - Puntuación obtenida
   */
  calculateScore(placeName, challenge) {
    const baseScore = 100
    const placeBonus = placeName.length * 5 // Bonus por nombre del lugar
    const challengeBonus = challenge.length * 2 // Bonus por complejidad del desafío
    return baseScore + placeBonus + challengeBonus
  }

  /**
   * Registrar visita al lugar en gamificación
   * @param {string} familyId - ID de la familia
   * @param {string} placeName - Nombre del lugar
   */
  async recordPlaceVisit(familyId, placeName) {
    try {
      await apiRequest(`gamification/family/${familyId}/visit-place?place_name=${encodeURIComponent(placeName)}`, 'POST')
    } catch (error) {
      console.error('Error registrando visita:', error)
    }
  }

  /**
   * Registrar desafío completado en gamificación
   * @param {string} familyId - ID de la familia
   */
  async recordChallengeCompletion(familyId) {
    try {
      await apiRequest(`gamification/family/${familyId}/complete-challenge`, 'POST')
    } catch (error) {
      console.error('Error registrando desafío completado:', error)
    }
  }

  /**
   * Obtener desafío de fallback cuando el backend no está disponible
   * @param {string} placeName - Nombre del lugar
   * @param {Array<number>} childrenAges - Edades de los niños
   * @returns {Object} - Desafío de fallback
   */
  getFallbackChallenge(placeName, childrenAges = [6, 8]) {
    console.log(`🔄 Usando desafío de fallback para ${placeName}`)
    
    const fallbackChallenges = {
      'Plaza Mayor': [
        'Busca la estatua de Felipe III y cuenta cuántos dientes tiene el caballo',
        'Encuentra la moneda mágica escondida cerca de la estatua del rey',
        'Cuenta todas las ventanas de la plaza y encuentra la más mágica'
      ],
      'Puerta del Sol': [
        'Encuentra el kilómetro cero y salta sobre él tres veces',
        'Busca la estatua del Oso y el Madroño y cuéntale un secreto',
        'Encuentra el reloj de la Puerta del Sol y dime qué hora marca'
      ],
      'Palacio Real': [
        'Busca el trono real y imagina que eres rey por un día',
        'Cuenta cuántas banderas hay en el palacio',
        'Encuentra el escudo de armas y descríbelo'
      ],
      'Parque del Retiro': [
        'Encuentra el Palacio de Cristal y busca tu reflejo mágico',
        'Cuenta cuántos patos hay en el estanque',
        'Busca el árbol más alto del parque y abrázalo'
      ],
      'Museo del Prado': [
        'Encuentra el cuadro de Las Meninas y cuenta cuántas personas hay',
        'Busca un cuadro con un gato y cuéntame su historia',
        'Encuentra el cuadro más grande del museo'
      ],
      'Mercado de San Miguel': [
        'Prueba un pincho de jamón ibérico y describe su sabor',
        'Cuenta cuántos puestos de comida hay en el mercado',
        'Encuentra el puesto más colorido y toma una foto'
      ]
    }

    const challenges = fallbackChallenges[placeName] || [
      `Explora ${placeName} y encuentra algo mágico`,
      `Busca en ${placeName} un detalle que nadie más haya notado`,
      `Cuenta algo interesante que veas en ${placeName}`
    ]

    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]

    return {
      success: true,
      data: {
        challenge: randomChallenge,
        place_name: placeName,
        children_ages: childrenAges,
        has_real_data: false,
        challenge_source: 'fallback',
        difficulty: this.calculateDifficulty(childrenAges),
        estimated_time: this.calculateEstimatedTime(childrenAges),
        rewards: this.generateRewards(placeName)
      }
    }
  }

  /**
   * Calcular dificultad basada en las edades
   * @param {Array<number>} childrenAges - Edades de los niños
   * @returns {string} - Nivel de dificultad
   */
  calculateDifficulty(childrenAges) {
    const avgAge = childrenAges.reduce((sum, age) => sum + age, 0) / childrenAges.length
    
    if (avgAge < 4) return 'Muy Fácil'
    if (avgAge < 6) return 'Fácil'
    if (avgAge < 8) return 'Intermedio'
    if (avgAge < 10) return 'Desafiante'
    return 'Experto'
  }

  /**
   * Calcular tiempo estimado basado en las edades
   * @param {Array<number>} childrenAges - Edades de los niños
   * @returns {string} - Tiempo estimado
   */
  calculateEstimatedTime(childrenAges) {
    const avgAge = childrenAges.reduce((sum, age) => sum + age, 0) / childrenAges.length
    
    if (avgAge < 4) return '2-3 minutos'
    if (avgAge < 6) return '3-5 minutos'
    if (avgAge < 8) return '5-10 minutos'
    if (avgAge < 10) return '10-15 minutos'
    return '15-20 minutos'
  }

  /**
   * Generar recompensas para el lugar
   * @param {string} placeName - Nombre del lugar
   * @returns {Array<string>} - Lista de recompensas
   */
  generateRewards(placeName) {
    const baseRewards = [
      'Moneda mágica del Ratoncito Pérez',
      'Diente de oro brillante',
      'Tesoro escondido',
      'Poder mágico especial'
    ]

    const placeSpecificRewards = {
      'Plaza Mayor': ['Corona de rey', 'Espada mágica', 'Escudo dorado'],
      'Puerta del Sol': ['Reloj mágico', 'Estrella brillante', 'Moneda del tiempo'],
      'Palacio Real': ['Corona real', 'Cetro mágico', 'Anillo del poder'],
      'Parque del Retiro': ['Hoja mágica', 'Flor encantada', 'Semilla de sueños'],
      'Museo del Prado': ['Pincel mágico', 'Cuadro en miniatura', 'Paleta de colores'],
      'Mercado de San Miguel': ['Pincho mágico', 'Receta secreta', 'Sabor especial']
    }

    const specificRewards = placeSpecificRewards[placeName] || []
    return [...baseRewards, ...specificRewards].slice(0, 3)
  }

  /**
   * Obtener estadísticas de desafíos completados
   * @param {string} familyId - ID de la familia
   * @returns {Promise<Object>} - Estadísticas
   */
  async getChallengeStats(familyId) {
    try {
      const response = await apiRequest(`gamification/family/${familyId}/stats`, 'GET')
      
      if (response.success) {
        return {
          success: true,
          data: {
            total_challenges: response.data.challenges_completed || 0,
            completed_challenges: response.data.challenges_completed || 0,
            total_score: response.data.total_points || 0,
            average_score: response.data.total_points / Math.max(response.data.challenges_completed, 1) || 0,
            places_visited: response.data.places_visited_count || 0,
            current_level: response.data.current_level?.level || 1,
            achievements: response.data.achievements_count || 0
          }
        }
      } else {
        throw new Error(response.message || 'Error obteniendo estadísticas')
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return {
        success: false,
        data: {
          total_challenges: 0,
          completed_challenges: 0,
          total_score: 0,
          average_score: 0,
          places_visited: 0,
          current_level: 1,
          achievements: 0
        }
      }
    }
  }
}

export const challengeService = new ChallengeService()
