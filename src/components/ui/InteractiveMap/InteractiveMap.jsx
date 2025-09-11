import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const MapCenter = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])
  
  return null
}


const InteractiveMap = ({ 
  userLocation = null, 
  routePlaces = [], 
  onPlaceSelect = null,
  selectedPlace = null,
  showRoute = true,
  className = "h-96 w-full",
  childrenAges = [6, 8]
}) => {
  const [mapCenter, setMapCenter] = useState([40.4168, -3.7038]) 
  const [mapZoom, setMapZoom] = useState(13)
  const [hoveredPlace, setHoveredPlace] = useState(null)

 
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude])
      setMapZoom(15)
    }
  }, [userLocation])


  const createCustomIcon = (color, icon, isHovered = false) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: ${color};
        width: ${isHovered ? '36px' : '30px'};
        height: ${isHovered ? '36px' : '30px'};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 ${isHovered ? '4px' : '2px'} ${isHovered ? '8px' : '4px'} rgba(0,0,0,${isHovered ? '0.4' : '0.3'});
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isHovered ? '18px' : '16px'};
        color: white;
        transition: all 0.3s ease;
        cursor: pointer;
        transform: ${isHovered ? 'scale(1.1)' : 'scale(1)'};
      ">${icon}</div>`,
      iconSize: [isHovered ? 36 : 30, isHovered ? 36 : 30],
      iconAnchor: [isHovered ? 18 : 15, isHovered ? 18 : 15]
    })
  }


  const getPlaceIcon = (place, isHovered = false) => {
    if (place.type === 'start') {
      return createCustomIcon('#10B981', '🏁', isHovered) 
    } else if (place.type === 'end') {
      return createCustomIcon('#EF4444', '🏆', isHovered) 
    } else if (place.type === 'checkpoint') {
      return createCustomIcon('#3B82F6', '📍', isHovered) 
    } else {
      return createCustomIcon('#8B5CF6', '🎯', isHovered) 
    }
  }

 
  const handlePlaceClick = (place) => {
    if (onPlaceSelect) {
      onPlaceSelect(place)
    }
  }

 
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
            <Popup maxWidth={250} className="custom-popup">
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    👤
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">Tu ubicación</h4>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-800 font-medium">Coordenadas GPS</p>
                  <p className="text-xs text-blue-600">
                    Lat: {userLocation.latitude.toFixed(4)}<br />
                    Lng: {userLocation.longitude.toFixed(4)}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  ¡Aquí estás tú! 🎯
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de los lugares de la ruta */}
        {routePlaces.map((place, index) => {
          const isHovered = hoveredPlace === place.id || hoveredPlace === index
          return (
            <Marker
              key={place.id || index}
              position={[place.latitude, place.longitude]}
              icon={getPlaceIcon(place, isHovered)}
              eventHandlers={{
                click: () => handlePlaceClick(place),
                mouseover: () => setHoveredPlace(place.id || index),
                mouseout: () => setHoveredPlace(null)
              }}
            >
            <Popup maxWidth={300} maxHeight={400} className="custom-popup">
              <div className="p-4 min-w-[280px] max-h-[350px] overflow-y-auto relative">
                {/* Header del popup */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      {place.name || `Lugar ${index + 1}`}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {place.type === 'start' ? '🏁 Punto de inicio' : 
                       place.type === 'end' ? '🏆 Punto final' : 
                       place.type === 'checkpoint' ? '📍 Checkpoint' : 
                       '🎯 Lugar de interés'}
                    </p>
                  </div>
                </div>

                {/* Descripción */}
                {place.description && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {place.description}
                    </p>
                  </div>
                )}

                {/* Información adicional */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Orden: {index + 1} de {routePlaces.length}</span>
                  </div>
                </div>

                {/* Desafío */}
                {place.challenge && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 text-lg">🎯</span>
                      <div>
                        <p className="text-sm font-semibold text-yellow-800 mb-1">Desafío del Ratoncito Pérez</p>
                        <p className="text-xs text-yellow-700">{place.challenge}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recompensa */}
                {place.reward && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-r-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 text-lg">🏆</span>
                      <div>
                        <p className="text-sm font-semibold text-green-800 mb-1">Recompensa</p>
                        <p className="text-xs text-green-700">{place.reward}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </Popup>
          </Marker>
          )
        })}

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