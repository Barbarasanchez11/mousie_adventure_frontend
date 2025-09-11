import React from 'react'


const AdventureDisplay = ({ adventure }) => {
  if (!adventure) {
    return (
      <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-gray-500 text-sm sm:text-base">
          No hay aventura para mostrar
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          🎭 {adventure.title || 'Aventura del Ratoncito Pérez'}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Una aventura mágica te espera
        </p>
      </div>

      <div className="space-y-6">
        {/* Historia */}
        {adventure.story && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
              📖 Historia
            </h3>
            <p className="text-blue-700 text-sm sm:text-base leading-relaxed">
              {adventure.story}
            </p>
          </div>
        )}

        {/* Desafío */}
        {adventure.challenge && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-800 mb-3 flex items-center gap-2">
              🎯 Desafío
            </h3>
            <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">
              {adventure.challenge}
            </p>
          </div>
        )}

        {/* Curiosidad */}
        {adventure.curiosity && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
              💡 Curiosidad
            </h3>
            <p className="text-green-700 text-sm sm:text-base leading-relaxed">
              {adventure.curiosity}
            </p>
          </div>
        )}

        {/* Recompensa */}
        {adventure.reward && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
              🏆 Recompensa
            </h3>
            <p className="text-purple-700 text-sm sm:text-base leading-relaxed">
              {adventure.reward}
            </p>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            ℹ️ Información
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            {adventure.location && (
              <div>
                <span className="font-medium text-gray-700">📍 Ubicación:</span>
                <p className="text-gray-600">{adventure.location}</p>
              </div>
            )}
            {adventure.duration && (
              <div>
                <span className="font-medium text-gray-700">⏱️ Duración:</span>
                <p className="text-gray-600">{adventure.duration}</p>
              </div>
            )}
            {adventure.difficulty && (
              <div>
                <span className="font-medium text-gray-700">🎚️ Dificultad:</span>
                <p className="text-gray-600">{adventure.difficulty}</p>
              </div>
            )}
            {adventure.age_range && (
              <div>
                <span className="font-medium text-gray-700">👶 Edad:</span>
                <p className="text-gray-600">{adventure.age_range}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdventureDisplay
