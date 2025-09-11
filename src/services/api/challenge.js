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
      
      const requestData = {
        place_name: placeName,
        children_ages: childrenAges,
        place_data: placeData || {}
      }

      const response = await apiRequest(`${this.baseURL}/challenge/generate`, 'POST', requestData)
      
      if (response.success) {
        console.log(`✅ Desafío generado para ${placeName}:`, response.data)
        return {
          success: true,
          data: {
            challenge: response.data.challenge || 'Desafío mágico del Ratoncito Pérez',
            place_name: placeName,
            children_ages: childrenAges,
            has_real_data: response.data.has_real_data || false,
            challenge_source: response.data.challenge_source || 'ai_generated',
            difficulty: this.calculateDifficulty(childrenAges),
            estimated_time: this.calculateEstimatedTime(childrenAges),
            rewards: this.generateRewards(placeName)
          }
        }
      } else {
        throw new Error(response.message || 'Error generando desafío')
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
   * @returns {Promise<Object>} - Resultado de la validación
   */
  async validateChallenge(placeName, challenge, userAnswer) {
    try {
      const requestData = {
        place_name: placeName,
        challenge: challenge,
        user_answer: userAnswer
      }

      const response = await apiRequest(`${this.baseURL}/challenge/validate`, 'POST', requestData)
      
      if (response.success) {
        return {
          success: true,
          data: {
            is_correct: response.data.is_correct || false,
            score: response.data.score || 0,
            feedback: response.data.feedback || '¡Bien hecho!',
            rewards: response.data.rewards || []
          }
        }
      } else {
        throw new Error(response.message || 'Error validando desafío')
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
      const response = await apiRequest(`${this.baseURL}/challenge/stats?family_id=${familyId}`, 'GET')
      
      if (response.success) {
        return {
          success: true,
          data: response.data
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
          average_score: 0
        }
      }
    }
  }
}

export const challengeService = new ChallengeService()
