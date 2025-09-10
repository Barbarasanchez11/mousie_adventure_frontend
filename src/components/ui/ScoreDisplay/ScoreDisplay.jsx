import React from 'react'

// Componente para mostrar puntos y monedas
const ScoreDisplay = ({ points = 0, coins = 0, showAnimation = false }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-yellow-300">
      <div className="flex items-center justify-between">
        {/* Puntos */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-2xl sm:text-3xl">⭐</div>
          <div>
            <p className="text-xs sm:text-sm text-yellow-800 font-medium">Puntos</p>
            <p className={`text-lg sm:text-2xl font-bold text-yellow-900 ${showAnimation ? 'animate-bounce' : ''}`}>
              {points}
            </p>
          </div>
        </div>

        {/* Separador */}
        <div className="w-px h-12 bg-yellow-300"></div>

        {/* Monedas */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-2xl sm:text-3xl">🪙</div>
          <div>
            <p className="text-xs sm:text-sm text-yellow-800 font-medium">Monedas</p>
            <p className={`text-lg sm:text-2xl font-bold text-yellow-900 ${showAnimation ? 'animate-bounce' : ''}`}>
              {coins}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoreDisplay
