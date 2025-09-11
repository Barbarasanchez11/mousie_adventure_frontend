import React, { useState } from 'react'
import HealthCheck from '@components/ui/HealthCheck/HealthCheck'
import AdventureDisplay from '@components/ui/AdventureDisplay/AdventureDisplay'
import GamificationPanel from '@components/ui/GamificationPanel/GamificationPanel'
import RouteManager from '@components/ui/RouteManager/RouteManager'
import InteractiveMap from '@components/ui/InteractiveMap/InteractiveMap'
import { startAdventure } from '@services/api/adventure'

function App() {
  // Estados para aventuras
  const [adventure, setAdventure] = useState(null)
  const [adventureLoading, setAdventureLoading] = useState(false)
  const [adventureError, setAdventureError] = useState(null)




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


          {/* Sección del Mapa Interactivo */}
          <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
            <RouteManager />
          </div>

          {/* Sección del Mapa Interactivo con Chatbot */}
          <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
                🗺️ Mapa Interactivo de Madrid
              </h2>
              <InteractiveMap 
                userLocation={adventure?.location}
                childrenAges={[6, 8]}
                className="h-96 w-full"
              />
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


          {/* Sección de Gamificación */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <GamificationPanel />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App