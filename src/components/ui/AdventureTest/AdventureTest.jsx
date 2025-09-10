import React, { useState } from 'react'
import { testAdventure } from '@services/api/adventure'
import AdventureDisplay from '../AdventureDisplay/AdventureDisplay'

// Componente para probar aventuras sin GPS
const AdventureTest = () => {
  const [adventure, setAdventure] = useState(null) // Datos de la aventura
  const [loading, setLoading] = useState(false) // Si está cargando
  const [error, setError] = useState(null) // Error si hay alguno

  // Función para probar una aventura
  const handleTestAdventure = async () => {
    setLoading(true) // Empezamos a cargar
    setError(null) // Limpiamos errores anteriores
    setAdventure(null) // Limpiamos aventura anterior

    try {
      const response = await testAdventure() // Llamamos a la API
      
      if (response.success) {
        setAdventure(response.data) // Guardamos la aventura
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('No se pudo probar la aventura')
    } finally {
      setLoading(false) // Terminamos de cargar
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleTestAdventure}
        disabled={loading}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
        )}
        <span className="text-lg sm:text-xl">🧪</span>
        <span>{loading ? 'Probando...' : 'Probar Aventura'}</span>
      </button>

      {error && (
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="text-2xl sm:text-3xl mb-2">❌</div>
          <p className="text-red-600 text-sm sm:text-base font-medium">
            {error}
          </p>
        </div>
      )}

      {adventure && (
        <AdventureDisplay adventure={adventure} />
      )}
    </div>
  )
}

export default AdventureTest
