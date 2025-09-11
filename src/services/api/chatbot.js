import { apiRequest } from './config.js'

class RatoncitoChatbot {
  constructor() {
    this.apiBase = 'adventure'
    this.currentPlace = 'Plaza Mayor'
    this.childrenAges = [6, 8]
    this.conversationHistory = []
  }

  /**
   * Envía un mensaje al chatbot del Ratoncito Pérez
   * @param {string} message - Mensaje del usuario
   * @param {string} placeName - Nombre del lugar actual
   * @param {Array} childrenAges - Edades de los niños
   * @returns {Promise<Object>} Respuesta del chatbot
   */
  async sendMessage(message, placeName = null, childrenAges = null) {
    try { 
      const requestData = {
        message: message,
        place_name: placeName || this.currentPlace,
        children_ages: childrenAges || this.childrenAges,
        conversation_history: this.conversationHistory
      }

      const response = await apiRequest(`${this.apiBase}/chatbot`, 'POST', requestData)
      
      if (response.success && response.data.status === 'success') {
        const botResponse = {
          id: Date.now(),
          type: 'bot',
          message: response.data.response || '¡Hola! Soy el Ratoncito Pérez. ¿En qué puedo ayudarte?',
          story: response.data.story || '',
          curiosity: response.data.curiosity || '',
          place_name: response.data.place_name || this.currentPlace,
          timestamp: new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }

       
        this.conversationHistory.push(
          { role: 'user', content: message },
          { role: 'bot', content: response.data.response }
        )

        if (this.conversationHistory.length > 10) {
          this.conversationHistory = this.conversationHistory.slice(-10)
        }
        
       
        return {
          success: true,
          data: botResponse
        }
      } else {
        throw new Error(response.message || 'Error obteniendo respuesta del Ratoncito')
      }
    } catch (error) {
      console.error('Error enviando mensaje al Ratoncito:', error)
      return this.getFallbackResponse(message)
    }
  }

  /**
   * Obtiene ejemplos de mensajes del backend
   * @returns {Promise<Array>} Lista de ejemplos
   */
  async getExamples() {
    try {
      
      const response = await apiRequest(`${this.apiBase}/chatbot/examples`, 'GET')
      
      if (response.success) {
        return {
          success: true,
          data: response.data.examples || []
        }
      } else {
        throw new Error(response.message || 'Error obteniendo ejemplos')
      }
    } catch (error) {
      console.error('Error obteniendo ejemplos:', error)
      return {
        success: true,
        data: this.getFallbackExamples()
      }
    }
  }

 
  getFallbackResponse(message) {
    const fallbackResponses = [
      "¡Hola! Soy el Ratoncito Pérez. ¿En qué puedo ayudarte en tu aventura por Madrid?",
      "¡Qué pregunta tan interesante! Déjame pensar en una historia mágica...",
      "¡Excelente pregunta! Como Ratoncito Pérez, te puedo contar muchas cosas mágicas sobre este lugar.",
      "¡Hola! Estoy aquí para ayudarte con tu aventura en Madrid. ¿Qué te gustaría saber?",
      "¡Qué divertido! Me encanta cuando los niños hacen preguntas. Te voy a contar algo especial..."
    ]

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    
    const botResponse = {
      id: Date.now(),
      type: 'bot',
      message: randomResponse,
      story: '',
      curiosity: '',
      place_name: this.currentPlace,
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

   
    this.conversationHistory.push(
      { role: 'user', content: message },
      { role: 'bot', content: randomResponse }
    )
    
    return {
      success: true,
      data: botResponse
    }
  }

 
  getFallbackExamples() {
    return [
      "Cuéntame una historia sobre este lugar",
      "¿Qué secretos esconde este sitio?",
      "¿Cómo llegaste aquí, Ratoncito?",
      "¿Qué puedo hacer en este lugar?",
      "¿Tienes alguna aventura para mí?"
    ]
  }

  
  setCurrentPlace(placeName) {
    this.currentPlace = placeName
  }

 
  setChildrenAges(ages) {
    this.childrenAges = ages
  }

  
  getConversationHistory() {
    return this.conversationHistory
  }

  
  clearHistory() {
    this.conversationHistory = []
  }

  
  addUserMessage(message) {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message,
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    
    return userMessage
  }
}


const ratoncitoChatbot = new RatoncitoChatbot()
export default ratoncitoChatbot