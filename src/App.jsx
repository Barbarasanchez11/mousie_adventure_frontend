import React from 'react'
import GamificationPanel from '@components/ui/GamificationPanel/GamificationPanel'

function App() {
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
          
          {/* Gamification Panel */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <GamificationPanel />
            </div>
          </div>
          
          {/* Status */}
          <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2 inline-block">
            <p>🏆 Sistema de Gamificación - En desarrollo</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App