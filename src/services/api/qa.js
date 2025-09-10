import { apiRequest } from './config.js'

// Función para hacer una pregunta al Ratoncito Pérez
/**
 * Envía una pregunta al backend para que el Ratoncito Pérez la responda.
 * @param {string} questionText - La pregunta que el usuario quiere hacer.
 * @returns {Promise<Object>} - Una promesa con la respuesta del backend.
 */
export const askQuestion = async (questionText) => {
  try {
    const response = await apiRequest('qa/ask', 'POST', { question: questionText })
    return response
  } catch (error) {
    console.error('Error al preguntar al Ratoncito Pérez:', error)
    return { success: false, message: 'No se pudo conectar con el Ratoncito Pérez.' }
  }
}
