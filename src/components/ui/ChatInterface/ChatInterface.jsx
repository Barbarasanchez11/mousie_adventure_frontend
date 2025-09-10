import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import MessageBubble from '@components/ui/MessageBubble/MessageBubble'

// Componente principal de la interfaz de chat
const ChatInterface = ({ messages, onSendMessage, loading, error }) => {
  const [inputMessage, setInputMessage] = useState('') // Estado para el texto del input
  const messagesEndRef = useRef(null) // Referencia para hacer scroll automático

  // Efecto para hacer scroll al final de los mensajes cuando se actualizan
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Maneja el envío del mensaje
  const handleSend = () => {
    if (inputMessage.trim() && !loading) {
      onSendMessage(inputMessage) // Llama a la función para enviar el mensaje
      setInputMessage('') // Limpia el input
    }
  }

  // Maneja la pulsación de teclas (ej: Enter para enviar)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-inner border border-gray-200">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-800 self-start rounded-xl rounded-bl-none p-3 shadow-sm text-sm sm:text-base">
              <span className="mr-2">🐭</span>
              <span>Escribiendo...</span>
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center mb-4">
            <div className="bg-red-50 text-red-800 p-3 rounded-xl shadow-sm text-sm sm:text-base">
              ❌ {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Elemento para el scroll automático */}
      </div>

      {/* Input para escribir mensajes */}
      <div className="border-t border-gray-200 p-4 sm:p-6 flex items-center gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Pregunta al Ratoncito Pérez..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm sm:text-base"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!inputMessage.trim() || loading}
          className="btn-primary px-4 py-3 text-sm sm:text-base"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

ChatInterface.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      sender: PropTypes.oneOf(['user', 'bot']).isRequired,
      timestamp: PropTypes.instanceOf(Date),
      isError: PropTypes.bool,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
}

export default ChatInterface
