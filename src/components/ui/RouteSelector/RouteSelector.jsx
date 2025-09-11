import React, { useState, useEffect } from 'react'
import { guideDataService } from '@services/api/guideData'

const RouteSelector = ({ onRouteSelect, userLocation, childrenAges = [5, 8] }) => {
  const [thematicRoutes, setThematicRoutes] = useState({})
  const [selectedCategories, setSelectedCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [customRoute, setCustomRoute] = useState(null)

  // Cargar rutas temáticas al montar el componente
  useEffect(() => {
    loadThematicRoutes()
  }, [])

  const loadThematicRoutes = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await guideDataService.getThematicRoutes()
      if (response.success) {
        setThematicRoutes(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Error cargando rutas temáticas')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleGenerateCustomRoute = async () => {
    if (selectedCategories.length === 0) {
      setError('Selecciona al menos una categoría')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await guideDataService.generateCustomRoute(
        selectedCategories,
        userLocation,
        childrenAges
      )

      if (response.success) {
        setCustomRoute(response.data)
        if (onRouteSelect) {
          onRouteSelect(response.data)
        }
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Error generando ruta personalizada')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPredefinedRoute = async (routeKey) => {
    const route = thematicRoutes[routeKey]
    if (!route) return

    setLoading(true)
    setError(null)

    try {
      const response = await guideDataService.generateCustomRoute(
        [routeKey],
        userLocation,
        childrenAges
      )

      if (response.success) {
        setCustomRoute(response.data)
        if (onRouteSelect) {
          onRouteSelect(response.data)
        }
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Error generando ruta predefinida')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-600">Cargando rutas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🗺️ Selecciona tu Ruta de Aventura
        </h2>
        <p className="text-gray-600">
          Elige una ruta temática o crea tu propia aventura personalizada
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-500 text-lg mr-2">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Rutas Predefinidas */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🎯 Rutas Predefinidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(thematicRoutes).map(([key, route]) => (
            <div
              key={key}
              onClick={() => handleSelectPredefinedRoute(key)}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-purple-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: route.color }}
                >
                  {route.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{route.name}</h4>
                  <p className="text-sm text-gray-600">{route.places.length} lugares</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{route.description}</p>
              <div className="flex flex-wrap gap-1">
                {route.places.slice(0, 3).map((place, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white px-2 py-1 rounded-full text-gray-600"
                  >
                    {place}
                  </span>
                ))}
                {route.places.length > 3 && (
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                    +{route.places.length - 3} más
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ruta Personalizada */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🎨 Crea tu Ruta Personalizada
        </h3>
        
        {/* Selección de Categorías */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            Selecciona las categorías que te interesan:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(thematicRoutes).map(([key, route]) => (
              <button
                key={key}
                onClick={() => handleCategoryToggle(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategories.includes(key)
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{route.icon}</span>
                {route.name}
              </button>
            ))}
          </div>
        </div>

        {/* Botón Generar Ruta */}
        <button
          onClick={handleGenerateCustomRoute}
          disabled={selectedCategories.length === 0 || loading}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            selectedCategories.length === 0 || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generando ruta...
            </div>
          ) : (
            `🎯 Generar Ruta Personalizada (${selectedCategories.length} categorías)`
          )}
        </button>
      </div>

      {/* Ruta Generada */}
      {customRoute && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-green-600 text-xl">✅</span>
            <h4 className="font-semibold text-green-800">Ruta Generada</h4>
          </div>
          <p className="text-green-700 mb-2">
            <strong>{customRoute.name}</strong>
          </p>
          <p className="text-sm text-green-600">
            {customRoute.total_places} lugares • {customRoute.estimated_duration} • {customRoute.difficulty}
          </p>
        </div>
      )}

      {/* Información de Ubicación */}
      {userLocation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">📍</span>
            <span className="text-sm font-medium text-blue-800">Tu ubicación actual</span>
          </div>
          <p className="text-xs text-blue-600">
            Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  )
}

export default RouteSelector
