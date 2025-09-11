import React, { useState, useEffect } from 'react'
import InteractiveMap from '@components/ui/InteractiveMap/InteractiveMap'
import RouteSelector from '@components/ui/RouteSelector/RouteSelector'
import ChallengeModal from '@components/ui/ChallengeModal/ChallengeModal'
import { generateRoute } from '@services/api/route'
import { guideService } from '@services/api/guide'
import { getMadridPlacesForMap, getMadridRoutesForMap, MADRID_PLACES } from '@data/madridPlaces'
import { useGeolocation } from '@hooks/location/useGeolocation'

// Componente para gestionar rutas y mostrar el mapa
const RouteManager = () => {
  const [route, setRoute] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [completedPlaces, setCompletedPlaces] = useState(new Set()) // Lugares completados
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0) // Lugar actual
  const [showRouteSelector, setShowRouteSelector] = useState(true) // Mostrar selector de rutas
  const [showChallengeModal, setShowChallengeModal] = useState(false) // Mostrar modal de desafío
  const [challengePlace, setChallengePlace] = useState(null) // Lugar para el desafío
  
  // Hook para obtener la ubicación del usuario
  const { location, loading: locationLoading, error: locationError } = useGeolocation()

  // Generar una nueva ruta usando lugares reales de Madrid
  const handleGenerateRoute = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Usar lugares reales de Madrid
      const madridPlaces = getMadridPlacesForMap()
      const madridRoutes = getMadridRoutesForMap()
      
      // Crear una ruta simulada con lugares reales
      const simulatedRoute = {
        route_id: 'madrid_real_route_' + Date.now(),
        name: 'Ruta Clásica de Madrid',
        description: 'Una ruta tradicional por los lugares más emblemáticos de Madrid',
        total_places: madridPlaces.length,
        estimated_duration: '2-3 horas',
        difficulty: 'Fácil',
        places: madridPlaces,
        routes: madridRoutes,
        source: 'local'
      }
      
      setRoute(simulatedRoute)
      setSelectedPlace(null)
      setCompletedPlaces(new Set())
      setCurrentPlaceIndex(0)
      setShowRouteSelector(false)
      
    } catch (err) {
      console.error('Error al generar ruta:', err)
      setError('Error al generar la ruta de Madrid')
    } finally {
      setLoading(false)
    }
  }

  // Manejar selección de un lugar
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place)
  }

  // Manejar selección de ruta desde el selector
  const handleRouteSelect = (selectedRoute) => {
    setRoute(selectedRoute)
    setShowRouteSelector(false)
    setSelectedPlace(null)
    setCompletedPlaces(new Set())
    setCurrentPlaceIndex(0)
  }

  // Manejar inicio de desafío
  const handleStartChallenge = (place) => {
    setChallengePlace(place)
    setShowChallengeModal(true)
  }

  // Manejar completado de desafío
  const handleChallengeComplete = (challengeData) => {
    console.log('Desafío completado:', challengeData)
    
    // Marcar el lugar como completado
    const placeIndex = route.places.findIndex(p => p.name === challengeData.place.name)
    if (placeIndex !== -1) {
      setCompletedPlaces(prev => new Set([...prev, placeIndex]))
    }
    
    // Cerrar el modal
    setShowChallengeModal(false)
    setChallengePlace(null)
  }

  // Marcar un lugar como completado
  const handleCompletePlace = (placeIndex) => {
    setCompletedPlaces(prev => new Set([...prev, placeIndex]))
    
    // Si es el lugar actual, avanzar al siguiente
    if (placeIndex === currentPlaceIndex && placeIndex < (route?.places.length - 1)) {
      setCurrentPlaceIndex(placeIndex + 1)
    }
  }

  // Marcar un lugar como no completado
  const handleUncompletePlace = (placeIndex) => {
    setCompletedPlaces(prev => {
      const newSet = new Set(prev)
      newSet.delete(placeIndex)
      return newSet
    })
  }

  // Calcular progreso de la ruta
  const getRouteProgress = () => {
    if (!route?.places) return 0
    return Math.round((completedPlaces.size / route.places.length) * 100)
  }

  // Obtener el siguiente lugar a visitar
  const getNextPlace = () => {
    if (!route?.places) return null
    return route.places[currentPlaceIndex]
  }

  // Obtener lugares completados
  const getCompletedPlaces = () => {
    if (!route?.places) return []
    return Array.from(completedPlaces).map(index => route.places[index])
  }

  // No cargar ruta automáticamente - el usuario debe seleccionar una
  // useEffect(() => {
  //   handleGenerateRoute()
  // }, [])

  return (
    <div className="space-y-6">
      {/* Selector de Rutas */}
      {showRouteSelector && (
        <RouteSelector
          onRouteSelect={handleRouteSelect}
          userLocation={location}
          childrenAges={[5, 8]}
        />
      )}

      {/* Mapa y Ruta */}
      {route && !showRouteSelector && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              🗺️ {route.name || 'Ruta de Aventura en Madrid'}
            </h2>
            <p className="text-gray-600">
              {route.description || 'Explora los lugares más mágicos de Madrid con el Ratoncito Pérez'}
            </p>
            <button
              onClick={() => setShowRouteSelector(true)}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800 underline"
            >
              🔄 Cambiar ruta
            </button>
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

      {/* Barra de progreso de la ruta */}
      {route && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              🎯 Progreso de la Ruta
            </h3>
            <span className="text-sm font-medium text-gray-600">
              {completedPlaces.size} de {route.places.length} lugares completados
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getRouteProgress()}%` }}
            ></div>
          </div>
          
          {/* Porcentaje */}
          <div className="text-center">
            <span className="text-2xl font-bold text-primary-600">
              {getRouteProgress()}%
            </span>
            <span className="text-sm text-gray-600 ml-2">completado</span>
          </div>

          {/* Próximo lugar */}
          {getNextPlace() && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">
                🎯 Próximo lugar a visitar:
              </h4>
              <p className="text-blue-700">
                {getNextPlace().name || `Lugar ${currentPlaceIndex + 1}`}
              </p>
            </div>
          )}
        </div>
      )}

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

      {/* Información de rutas reales */}
      {route?.routes && route.routes.length > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🗺️ Rutas Disponibles en Madrid
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {route.routes.slice(0, 6).map((routeItem, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600">📍</span>
                  <span className="font-medium text-gray-800">{routeItem.from.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🎯</span>
                  <span className="text-gray-600">{routeItem.to.name}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-blue-600 mt-2">
            Total de {route.routes.length} conexiones disponibles entre lugares de Madrid
          </p>
        </div>
      )}

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
            {route.places.map((place, index) => {
              const isCompleted = completedPlaces.has(index)
              const isCurrent = index === currentPlaceIndex
              const isSelected = selectedPlace === place
              
              return (
                <div
                  key={place.id || index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : isCompleted
                      ? 'border-green-500 bg-green-50'
                      : isCurrent
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlaceSelect(place)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold text-sm ${
                        isCompleted
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-blue-500'
                          : 'bg-primary-500'
                      }`}>
                        {isCompleted ? '✅' : index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800">
                          {place.name || `Lugar ${index + 1}`}
                        </h4>
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <span className="text-green-600 text-sm font-medium">
                              ✅ Completado
                            </span>
                          )}
                          {isCurrent && !isCompleted && (
                            <span className="text-blue-600 text-sm font-medium">
                              🎯 Actual
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {place.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {place.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 text-xs mb-3">
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

                      {/* Botones de acción */}
                      <div className="flex gap-2">
                        {!isCompleted ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCompletePlace(index)
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            ✅ Marcar como completado
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUncompletePlace(index)
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            ↩️ Desmarcar
                          </button>
                        )}
                        
                        {isCurrent && !isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartChallenge(place)
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            🎯 Iniciar Desafío
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
      )}

      {/* Modal de Desafío */}
      <ChallengeModal
        isOpen={showChallengeModal}
        onClose={() => {
          setShowChallengeModal(false)
          setChallengePlace(null)
        }}
        place={challengePlace}
        childrenAges={[6, 8]}
        onChallengeComplete={handleChallengeComplete}
      />
    </div>
  )
}

export default RouteManager
