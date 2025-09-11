import React, { useState } from 'react'
import LocationButton from '@components/ui/LocationButton/LocationButton'
import HealthCheck from '@components/ui/HealthCheck/HealthCheck'
import AdventureTest from '@components/ui/AdventureTest/AdventureTest'
import AdventureDisplay from '@components/ui/AdventureDisplay/AdventureDisplay'
import ChatInterface from '@components/ui/ChatInterface/ChatInterface'
import GamificationPanel from '@components/ui/GamificationPanel/GamificationPanel'
import BackendTest from '@components/ui/BackendTest/BackendTest'
import RouteManager from '@components/ui/RouteManager/RouteManager'
import { startAdventure } from '@services/api/adventure'
import { askQuestion } from '@services/api/qa'

function App() {
  // Estados para aventuras
  const [adventure, setAdventure] = useState(null)
  const [adventureLoading, setAdventureLoading] = useState(false)
  const [adventureError, setAdventureError] = useState(null)

  // Estados para chat
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! Soy el Ratoncito Pérez. ¿En qué puedo ayudarte?', sender: 'bot', timestamp: new Date() },
  ])
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState(null)

  // Función para manejar cuando se obtiene la ubicación
  const handleLocationFound = async (location) => {
    setAdventureLoading(true)
    setAdventureError(null)

    try {
      // Simular edades de niños para la aventura
      const childAges = [5, 8] // Edades de ejemplo
      const response = await startAdventure(location, childAges)
      
      if (response.success) {
        setAdventure(response.data)
      } else {
        setAdventureError(response.message)
      }
    } catch (error) {
      setAdventureError('No se pudo iniciar la aventura')
    } finally {
      setAdventureLoading(false)
    }
  }

  // Función para enviar una pregunta al Ratoncito Pérez
  const handleSendMessage = async (question) => {
    const newMessage = { id: messages.length + 1, text: question, sender: 'user', timestamp: new Date() }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setChatLoading(true)
    setChatError(null)

    try {
      const response = await askQuestion(question)
      if (response.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: response.data.answer, sender: 'bot', timestamp: new Date() },
        ])
      } else {
        setChatError(response.message)
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: `Error: ${response.message}`, sender: 'bot', timestamp: new Date(), isError: true },
        ])
      }
    } catch (error) {
      setChatError('Error al conectar con el Ratoncito Pérez.')
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: 'Error al conectar con el Ratoncito Pérez.', sender: 'bot', timestamp: new Date(), isError: true },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-primary-600 mb-4 sm:mb-6">
              🐭 Ratoncito Pérez Adventure
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              La aventura familiar con el Ratoncito Pérez en Madrid
            </p>
          </div>

          {/* Sección de Pruebas del Backend */}
          <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
            <BackendTest />
          </div>

          {/* Sección del Mapa Interactivo */}
          <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
            <RouteManager />
          </div>

          {/* Sección de Ubicación */}
          <div className="max-w-md mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
                📍 Obtener Ubicación
              </h2>
              <LocationButton onLocationFound={handleLocationFound} />
            </div>
          </div>

          {/* Sección de Prueba de Aventuras */}
          <div className="max-w-md mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
                🧪 Probar Aventura
              </h2>
              <AdventureTest />
            </div>
          </div>

          {/* Sección de Aventura Actual */}
          {adventure && (
            <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
                  🎭 Aventura Actual
                </h2>
                <AdventureDisplay adventure={adventure} />
              </div>
            </div>
          )}

          {/* Sección de Chat */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
                💬 Pregunta al Ratoncito Pérez
              </h2>
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={chatLoading}
                error={chatError}
              />
            </div>
          </div>

          {/* Sección de Gamificación */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <GamificationPanel />
            </div>
          </div>

          {/* Status */}
          <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2 inline-block">
            <p>🚀 Aplicación Completa - Todas las funcionalidades integradas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App