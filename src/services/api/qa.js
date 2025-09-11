/**
 * Envía una pregunta al backend para que el Ratoncito Pérez la responda.
 * @param {string} questionText - La pregunta que el usuario quiere hacer.
 * @returns {Promise<Object>} - Una promesa con la respuesta del backend.
 */
export const askQuestion = async (questionText) => {
 
  return {
    success: true,
    data: {
      answer: `¡Hola! Soy el Ratoncito Pérez. Has preguntado: "${questionText}". Aunque no puedo conectar con mi sistema principal, estoy aquí para ayudarte. ¿Tienes alguna pregunta sobre aventuras mágicas o dientes de leche? ¡Estoy listo para contarte historias increíbles!`
    }
  }
}
