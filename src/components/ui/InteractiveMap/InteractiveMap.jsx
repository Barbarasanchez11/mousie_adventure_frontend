import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Componente para centrar el mapa en la ubicación del usuario
const MapCenter = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])
  
  return null
}

// Componente principal del mapa interactivo
const InteractiveMap = ({ 
  userLocation = null, 
  routePlaces = [], 
  onPlaceSelect = null,
  selectedPlace = null,
  showRoute = true,
  className = "h-96 w-full"
}) => {
  const [mapCenter, setMapCenter] = useState([40.4168, -3.7038]) // Madrid por defecto
  const [mapZoom, setMapZoom] = useState(13)

  // Centrar el mapa en la ubicación del usuario si está disponible
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude])
      setMapZoom(15)
    }
  }, [userLocation])

  // Crear iconos personalizados
  const createCustomIcon = (color, icon) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
      ">${icon}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
  }

  // Iconos para diferentes tipos de lugares
  const getPlaceIcon = (place) => {
    if (place.type === 'start') {
      return createCustomIcon('#10B981', '🏁') // Verde para inicio
    } else if (place.type === 'end') {
      return createCustomIcon('#EF4444', '🏆') // Rojo para final
    } else if (place.type === 'checkpoint') {
      return createCustomIcon('#3B82F6', '📍') // Azul para checkpoints
    } else {
      return createCustomIcon('#8B5CF6', '🎯') // Púrpura para lugares normales
    }
  }

  // Manejar clic en un lugar
  const handlePlaceClick = (place) => {
    if (onPlaceSelect) {
      onPlaceSelect(place)
    }
  }

  // Crear polilínea para la ruta
  const routeCoordinates = routePlaces.map(place => [place.latitude, place.longitude])

  return (
    <div className={`relative ${className}`}>
      {/* Título del mapa */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <h3 className="text-sm font-semibold text-gray-800">
          🗺️ Ruta del Ratoncito Pérez
        </h3>
        <p className="text-xs text-gray-600">
          {routePlaces.length} lugares en Madrid
        </p>
      </div>

      {/* Controles del mapa */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <button
          onClick={() => setMapZoom(mapZoom + 1)}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-white transition-colors"
          title="Acercar"
        >
          <span className="text-lg">➕</span>
        </button>
        <button
          onClick={() => setMapZoom(mapZoom - 1)}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-white transition-colors"
          title="Alejar"
        >
          <span className="text-lg">➖</span>
        </button>
        {userLocation && (
          <button
            onClick={() => {
              setMapCenter([userLocation.latitude, userLocation.longitude])
              setMapZoom(15)
            }}
            className="bg-blue-500 text-white rounded-lg p-2 shadow-lg hover:bg-blue-600 transition-colors"
            title="Centrar en mi ubicación"
          >
            <span className="text-lg">📍</span>
          </button>
        )}
      </div>

      {/* Mapa */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full rounded-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Centrar el mapa */}
        <MapCenter center={mapCenter} zoom={mapZoom} />
        
        {/* Marcador de la ubicación del usuario */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createCustomIcon('#F59E0B', '👤')}
          >
            <Popup>
              <div className="text-center">
                <h4 className="font-semibold text-gray-800">Tu ubicación</h4>
                <p className="text-sm text-gray-600">
                  Lat: {userLocation.latitude.toFixed(4)}<br />
                  Lng: {userLocation.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de los lugares de la ruta */}
        {routePlaces.map((place, index) => (
          <Marker
            key={place.id || index}
            position={[place.latitude, place.longitude]}
            icon={getPlaceIcon(place)}
            eventHandlers={{
              click: () => handlePlaceClick(place)
            }}
          >
            <Popup>
              <div className="text-center min-w-[200px]">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {place.name || `Lugar ${index + 1}`}
                </h4>
                {place.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {place.description}
                  </p>
                )}
                {place.challenge && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-2">
                    <p className="text-xs font-medium text-yellow-800">
                      🎯 Desafío: {place.challenge}
                    </p>
                  </div>
                )}
                {place.reward && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <p className="text-xs font-medium text-green-800">
                      🏆 Recompensa: {place.reward}
                    </p>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Orden: {index + 1} de {routePlaces.length}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Línea de la ruta */}
        {showRoute && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#8B5CF6"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-semibold text-gray-800 mb-2">Leyenda:</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Inicio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Checkpoint</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Lugar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Final</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Tu ubicación</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InteractiveMap