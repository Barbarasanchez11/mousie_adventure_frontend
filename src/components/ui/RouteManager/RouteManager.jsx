import React, { useState, useEffect } from 'react'
import InteractiveMap from '@components/ui/InteractiveMap/InteractiveMap'
import { generateRoute } from '@services/api/route'
import { useGeolocation } from '@hooks/location/useGeolocation'

// Componente para gestionar rutas y mostrar el mapa
const RouteManager = () => {
  const [route, setRoute] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Hook para obtener la ubicación del usuario
  const { location, loading: locationLoading, error: locationError } = useGeolocation()

  // Generar una nueva ruta
  const handleGenerateRoute = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Si no hay ubicación del usuario, usar Madrid por defecto
      const startLocation = location || {
        latitude: 40.4168,
        longitude: -3.7038
      }

      const response = await generateRoute(startLocation, [5, 8]) // Edades de ejemplo
      
      if (response.success) {
        setRoute(response.data)
        setSelectedPlace(null)
      } else {
        setError(response.message || 'Error al generar la ruta')
      }
    } catch (err) {
      console.error('Error al generar ruta:', err)
      setError('Error de conexión al generar la ruta')
    } finally {
      setLoading(false)
    }
  }

  // Manejar selección de un lugar
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place)
  }

  // Cargar ruta de ejemplo al montar el componente
  useEffect(() => {
    handleGenerateRoute()
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🗺️ Gestor de Rutas del Ratoncito Pérez
        </h2>
        <p className="text-gray-600">
          Explora los lugares mágicos de Madrid donde el Ratoncito Pérez tiene aventuras preparadas
        </p>
      </div>

      {/* Controles */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <button
          onClick={handleGenerateRoute}
          disabled={loading}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generando...
            </>
          ) : (
            <>
              <span>🔄</span>
              Generar Nueva Ruta
            </>
          )}
        </button>

        {location && (
          <div className="text-sm text-green-600 flex items-center gap-2">
            <span>📍</span>
            Ubicación detectada: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </div>
        )}

        {locationError && (
          <div className="text-sm text-red-600 flex items-center gap-2">
            <span>⚠️</span>
            Error de ubicación: {locationError}
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="mb-6">
        <InteractiveMap
          userLocation={location}
          routePlaces={route?.places || []}
          onPlaceSelect={handlePlaceSelect}
          selectedPlace={selectedPlace}
          showRoute={true}
          className="h-96 w-full"
        />
      </div>

      {/* Información de la ruta */}
      {route && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📊 Información de la Ruta</h3>
            <div className="space-y-1 text-sm">
              <p><strong>ID:</strong> {route.route_id}</p>
              <p><strong>Lugares:</strong> {route.total_places}</p>
              <p><strong>Duración:</strong> {route.estimated_duration}</p>
              <p><strong>Dificultad:</strong> {route.difficulty}</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">🎯 Objetivos</h3>
            <div className="space-y-1 text-sm">
              <p>• Completar {route.total_places} desafíos</p>
              <p>• Explorar lugares históricos</p>
              <p>• Ganar puntos y recompensas</p>
              <p>• Aprender sobre Madrid</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">🏆 Recompensas</h3>
            <div className="space-y-1 text-sm">
              <p>• Puntos por completar desafíos</p>
              <p>• Monedas mágicas</p>
              <p>• Logros especiales</p>
              <p>• Conocimiento sobre Madrid</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de lugares */}
      {route?.places && route.places.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📍 Lugares de la Ruta ({route.places.length})
          </h3>
          <div className="space-y-3">
            {route.places.map((place, index) => (
              <div
                key={place.id || index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlace === place
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => handlePlaceSelect(place)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {place.name || `Lugar ${index + 1}`}
                    </h4>
                    {place.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {place.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        📍 {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                      </span>
                      {place.challenge && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          🎯 {place.challenge}
                        </span>
                      )}
                      {place.reward && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          🏆 {place.reward}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lugar seleccionado */}
      {selectedPlace && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">
            🎯 Lugar Seleccionado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                {selectedPlace.name || 'Lugar seleccionado'}
              </h4>
              {selectedPlace.description && (
                <p className="text-gray-600 mb-3">
                  {selectedPlace.description}
                </p>
              )}
              <div className="text-sm text-gray-500">
                <p>📍 Coordenadas: {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}</p>
              </div>
            </div>
            <div>
              {selectedPlace.challenge && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <h5 className="font-semibold text-yellow-800 mb-1">🎯 Desafío</h5>
                  <p className="text-sm text-yellow-700">{selectedPlace.challenge}</p>
                </div>
              )}
              {selectedPlace.reward && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h5 className="font-semibold text-green-800 mb-1">🏆 Recompensa</h5>
                  <p className="text-sm text-green-700">{selectedPlace.reward}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteManager
