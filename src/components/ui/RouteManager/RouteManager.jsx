import React, { useState, useEffect } from 'react'
import InteractiveMap from '@components/ui/InteractiveMap/InteractiveMap'
import RouteSelector from '@components/ui/RouteSelector/RouteSelector'
import ChallengeModal from '@components/ui/ChallengeModal/ChallengeModal'
import { generateRoute } from '@services/api/route'
import { guideService } from '@services/api/guide'
import { getMadridPlacesForMap, getMadridRoutesForMap, MADRID_PLACES } from '@data/madridPlaces'
import { useGeolocation } from '@hooks/location/useGeolocation'


const RouteManager = () => {
  const [route, setRoute] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [completedPlaces, setCompletedPlaces] = useState(new Set()) 
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0) 
  const [showRouteSelector, setShowRouteSelector] = useState(true) 
  const [showChallengeModal, setShowChallengeModal] = useState(false) 
  const [challengePlace, setChallengePlace] = useState(null) 
  
 
  const { location, loading: locationLoading, error: locationError } = useGeolocation()

  
  const handleGenerateRoute = async () => {
    setLoading(true)
    setError(null)
    
    try {
  
      const madridPlaces = getMadridPlacesForMap()
      const madridRoutes = getMadridRoutesForMap()
      
     
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

  
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place)
  }

  const handleRouteSelect = (selectedRoute) => {
    setRoute(selectedRoute)
    setShowRouteSelector(false)
    setSelectedPlace(null)
    setCompletedPlaces(new Set())
    setCurrentPlaceIndex(0)
  }

 
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3 
    const φ1 = lat1 * Math.PI/180
    const φ2 = lat2 * Math.PI/180
    const Δφ = (lat2-lat1) * Math.PI/180
    const Δλ = (lon2-lon1) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c 
  }

 
  const isNearPlace = (place) => {
    if (!location || !place.latitude || !place.longitude) return false
    
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      place.latitude,
      place.longitude
    )
    
    return distance <= 100 
  }


  const handleStartChallenge = (place) => {
    setChallengePlace(place)
    setShowChallengeModal(true)
  }

  
  const handleChallengeComplete = (challengeData) => {
    console.log('Desafío completado:', challengeData)
    

    const placeIndex = route.places.findIndex(p => p.name === challengeData.place.name)
    if (placeIndex !== -1) {
      setCompletedPlaces(prev => new Set([...prev, placeIndex]))
    }
   
    setShowChallengeModal(false)
    setChallengePlace(null)
  }

  
  const handleCompletePlace = (placeIndex) => {
    setCompletedPlaces(prev => new Set([...prev, placeIndex]))
    
   
    if (placeIndex === currentPlaceIndex && placeIndex < (route?.places.length - 1)) {
      setCurrentPlaceIndex(placeIndex + 1)
    }
  }

 
  const handleUncompletePlace = (placeIndex) => {
    setCompletedPlaces(prev => {
      const newSet = new Set(prev)
      newSet.delete(placeIndex)
      return newSet
    })
  }

  
  const getRouteProgress = () => {
    if (!route?.places) return 0
    return Math.round((completedPlaces.size / route.places.length) * 100)
  }


  const getNextPlace = () => {
    if (!route?.places) return null
    return route.places[currentPlaceIndex]
  }

 
  const getCompletedPlaces = () => {
    if (!route?.places) return []
    return Array.from(completedPlaces).map(index => route.places[index])
  }


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
              className="mt-3 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <span>🔄</span>
              Cambiar ruta
            </button>
          </div>

      {/* Controles */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">


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
                      

                      {/* Botones de acción */}
                      <div className="flex flex-col xs:flex-row gap-2">
                        {!isCompleted ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCompletePlace(index)
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg font-medium transition-colors flex-1 min-w-0 px-0.5 text-[10px] xs:px-2 xs:py-1 xs:text-xs"
                          >
                            <span className="block xs:hidden">✅ Completado</span>
                            <span className="hidden xs:block">✅ Marcar como completado</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUncompletePlace(index)
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-1.5 rounded-lg font-medium transition-colors flex-1 min-w-0 px-0.5 text-[10px] xs:px-2 xs:py-1 xs:text-xs"
                          >
                            <span className="block xs:hidden">↩️ Desmarcar</span>
                            <span className="hidden xs:block">↩️ Desmarcar</span>
                          </button>
                        )}
                        
                        {/* Botón para el primer lugar (siempre visible) */}
                        {index === 0 && !isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartChallenge(place)
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg font-medium transition-colors flex-1 min-w-0 px-0.5 text-[10px] xs:px-2 xs:py-1 xs:text-xs"
                          >
                            <span className="block xs:hidden">🎯 Desafío</span>
                            <span className="hidden xs:block">🎯 Iniciar Desafío</span>
                          </button>
                        )}
                        
                        {/* Botón para otros lugares (solo cuando esté cerca) */}
                        {index > 0 && !isCompleted && isNearPlace(place) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartChallenge(place)
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg font-medium transition-colors flex-1 min-w-0 px-0.5 text-[10px] xs:px-2 xs:py-1 xs:text-xs"
                          >
                            <span className="block xs:hidden">🎯 Desafío</span>
                            <span className="hidden xs:block">🎯 Iniciar Desafío</span>
                          </button>
                        )}
                        
                        {/* Botón "Acércate al lugar" para lugares no cercanos */}
                        {index > 0 && !isCompleted && !isNearPlace(place) && (
                          <button
                            disabled
                            className="bg-gray-300 text-gray-500 py-1.5 rounded-lg font-medium transition-colors flex-1 min-w-0 px-0.5 text-[10px] xs:px-2 xs:py-1 xs:text-xs cursor-not-allowed"
                          >
                            <span className="block xs:hidden">📍 Acércate</span>
                            <span className="hidden xs:block">📍 Acércate al lugar</span>
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
