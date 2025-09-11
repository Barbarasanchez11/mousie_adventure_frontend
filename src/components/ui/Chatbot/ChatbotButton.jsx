import React, { useState } from 'react'
import Chatbot from './Chatbot.jsx'

const ChatbotButton = ({ coordinates, placeName, childrenAges = [6, 8] }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChat = () => {
    setIsOpen(true)
  }

  const handleCloseChat = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Botón flotante del chatbot en esquina inferior derecha */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 z-[9997] chatbot-button"
        title="Pregunta al Ratoncito Pérez"
      >
        <span className="text-3xl animate-bounce">🐭</span>
      </button>

      {/* Modal del chatbot */}
      <Chatbot
        isOpen={isOpen}
        onClose={handleCloseChat}
        coordinates={coordinates}
        placeName={placeName}
        childrenAges={childrenAges}
      />
    </>
  )
}

export default ChatbotButton
