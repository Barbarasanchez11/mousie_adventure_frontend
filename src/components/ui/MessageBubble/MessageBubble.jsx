import React from 'react'
import PropTypes from 'prop-types'


const MessageBubble = ({ message }) => {

  const isUser = message.sender === 'user'
  const bubbleClasses = isUser
    ? 'bg-primary-500 text-white self-end rounded-br-none' 
    : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
  const textClasses = isUser ? 'text-white' : 'text-gray-800'
  const timestampClasses = isUser ? 'text-primary-200' : 'text-gray-500'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] p-3 rounded-xl shadow-sm text-sm sm:text-base ${bubbleClasses}`}
      >
        <p className={`font-medium ${textClasses}`}>
          {/* Si es un mensaje del bot y no es un error, añade un emoji */}
          {!isUser && !message.isError && <span className="mr-2">🐭</span>}
          {message.text}
        </p>
        {message.timestamp && (
          <span className={`block text-xs mt-1 ${timestampClasses}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(['user', 'bot']).isRequired,
    timestamp: PropTypes.instanceOf(Date),
    isError: PropTypes.bool,
  }).isRequired,
}

export default MessageBubble
