import React from 'react'


const AchievementBadge = ({ 
  title, 
  description, 
  icon = '🏆', 
  isUnlocked = false, 
  points = 0 
}) => {
  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
      isUnlocked 
        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <div className="flex items-start gap-3">
        {/* Icono del logro */}
        <div className={`text-3xl sm:text-4xl ${isUnlocked ? 'animate-pulse' : 'grayscale'}`}>
          {icon}
        </div>
        
        {/* Contenido del logro */}
        <div className="flex-1">
          <h3 className={`text-sm sm:text-base font-bold mb-1 ${
            isUnlocked ? 'text-yellow-800' : 'text-gray-500'
          }`}>
            {title}
          </h3>
          <p className={`text-xs sm:text-sm mb-2 ${
            isUnlocked ? 'text-yellow-700' : 'text-gray-400'
          }`}>
            {description}
          </p>
          
          {/* Puntos del logro */}
          {points > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-yellow-600">⭐</span>
              <span className={`text-xs font-medium ${
                isUnlocked ? 'text-yellow-600' : 'text-gray-400'
              }`}>
                +{points} puntos
              </span>
            </div>
          )}
        </div>
        
        {/* Estado del logro */}
        <div className="text-right">
          {isUnlocked ? (
            <div className="text-green-500 text-lg">✅</div>
          ) : (
            <div className="text-gray-400 text-lg">🔒</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementBadge
