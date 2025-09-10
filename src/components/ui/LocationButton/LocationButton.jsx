import React from 'react'
import { useGeolocation } from '@hooks/location/useGeolocation'

// Componente botón para obtener la ubicación del usuario
const LocationButton = ({ onLocationFound }) => {
  const { location, loading, error, getLocation, isSupported } = useGeolocation()

  // Cuando se obtiene la ubicación, se llama a la función que se le pasó al botón
  React.useEffect(() => {
    if (location && onLocationFound) {
      onLocationFound(location)
    }
  }, [location, onLocationFound])

  // Si el navegador no soporta geolocalización, muestra un mensaje
  if (!isSupported) {
    return (
      <div className="text-center p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
        <div className="text-2xl sm:text-3xl mb-2">⚠️</div>
        <p className="text-yellow-800 text-sm sm:text-base font-medium">
          Tu navegador no soporta geolocalización
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <button
        onClick={getLocation}
        disabled={loading}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
        )}
        <span className="text-lg sm:text-xl">📍</span>
        <span>{loading ? 'Obteniendo ubicación...' : 'Obtener mi ubicación'}</span>
      </button>
      
      {error && (
        <div className="text-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm sm:text-base font-medium">
            ❌ {error}
          </p>
        </div>
      )}
      
      {location && (
        <div className="text-center p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm sm:text-base font-medium">
            ✅ Ubicación obtenida
          </p>
          <p className="text-green-500 text-xs sm:text-sm mt-1">
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  )
}

export default LocationButton
