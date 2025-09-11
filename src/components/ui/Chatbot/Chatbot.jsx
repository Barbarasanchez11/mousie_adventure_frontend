import React, { useState, useEffect, useRef } from 'react'
import ratoncitoChatbot from '../../../services/api/chatbot.js'

const Chatbot = ({ isOpen, onClose, coordinates, placeName, childrenAges = [6, 8] }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [examples, setExamples] = useState([])
  const [showExamples, setShowExamples] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        message: `¡Hola! Soy el Ratoncito Pérez desde ${placeName || 'Madrid'}. ¿En qué puedo ayudarte en tu aventura?`,
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
      setMessages([welcomeMessage])
      
    
      loadExamples()
    }
  }, [isOpen, placeName])

 
  const loadExamples = async () => {
    try {
      const response = await ratoncitoChatbot.getExamples()
      if (response.success) {
        setExamples(response.data)
      }
    } catch (error) {
      console.error('Error cargando ejemplos:', error)
    }
  }

 
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setShowExamples(false)

    try {
    
      const response = await ratoncitoChatbot.sendMessage(
        inputMessage.trim(),
        placeName,
        childrenAges
      )

      if (response.success) {
       
        const messagesToAdd = []
        
      
        if (response.data.story && response.data.story.trim().length > 0) {
          const storyMessage = {
            id: Date.now(),
            type: 'bot',
            message: response.data.story,
            timestamp: new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            isStory: true
          }
          messagesToAdd.push(storyMessage)
        } else {
      
          messagesToAdd.push(response.data)
        }
       
        if (response.data.curiosity && 
            response.data.curiosity !== response.data.story &&
            response.data.curiosity.trim().length > 0) {
          const curiosityMessage = {
            id: Date.now() + 1,
            type: 'bot',
            message: response.data.curiosity,
            timestamp: new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            isCuriosity: true
          }
          messagesToAdd.push(curiosityMessage)
        }
        
      
        setMessages(prev => [...prev, ...messagesToAdd])
      } else {
        throw new Error('Error obteniendo respuesta')
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        message: '¡Ups! El Ratoncito Pérez está ocupado. Inténtalo de nuevo en un momento.',
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleClearChat = () => {
    setMessages([])
    ratoncitoChatbot.clearHistory()
    setShowExamples(true)
  }


  const handleExampleClick = (example) => {
    setInputMessage(example)
    setShowExamples(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 chatbot-overlay">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col chatbot-content">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🐭</span>
            <div>
              <h2 className="font-bold text-lg">Pregunta al Ratoncito Pérez</h2>
              <p className="text-sm opacity-90">
                {placeName ? `En ${placeName}` : 'En Madrid'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : message.isStory
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-sm max-h-64 overflow-y-auto story-scroll'
                    : message.isCuriosity
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🐭</span>
                    <span className="text-xs font-medium text-gray-500">
                      {message.isStory ? '📖 Historia' : message.isCuriosity ? '💡 Curiosidad' : 'Ratoncito Pérez'}
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {/* Ejemplos de mensajes */}
          {showExamples && examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">💡 Preguntas sugeridas:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {examples.slice(0, 3).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="bg-white border border-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full hover:bg-purple-50 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregunta al Ratoncito Pérez..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? '...' : 'Enviar'}
            </button>
          </form>
          
          {/* Clear chat button */}
          <div className="flex justify-center mt-2">
            <button
              onClick={handleClearChat}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar conversación
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
