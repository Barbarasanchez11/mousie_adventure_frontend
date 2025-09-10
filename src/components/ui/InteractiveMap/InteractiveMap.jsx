import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Componente de mapa interactivo
const InteractiveMap = ({ 
  currentLocation, 
  route, 
  onPlaceSelect, 
  selectedPlace,
  className = "h-96 w-full rounded-xl"
}) => {
  const [mapCenter, setMapCenter] = useState([40.4168, -3.7038]) // Madrid por defecto
  const [mapZoom, setMapZoom] = useState(13)

  // Actualizar centro del mapa cuando cambie la ubicación
  useEffect(() => {
    if (currentLocation) {
      setMapCenter([currentLocation.latitude, currentLocation.longitude])
      setMapZoom(15)
    }
  }, [currentLocation])

  // Crear iconos personalizados
  const createCustomIcon = (color, icon) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${icon}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
  }

  // Iconos para diferentes tipos de lugares
  const getPlaceIcon = (place, index) => {
    if (place.visited) {
      return createCustomIcon('#10B981', '✅') // Verde para visitado
    } else if (place === selectedPlace) {
      return createCustomIcon('#3B82F6', '🎯') // Azul para seleccionado
    } else {
      return createCustomIcon('#F59E0B', '📍') // Amarillo para pendiente
    }
  }

  // Obtener coordenadas de la ruta para la línea
  const getRouteCoordinates = () => {
    if (!route?.places) return []
    return route.places.map(place => [place.latitude, place.longitude])
  }

  return (
    <div className={`${className} border border-gray-200 shadow-lg`}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Ubicación actual del usuario */}
        {currentLocation && (
          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={createCustomIcon('#EF4444', '🏠')}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-red-600">Tu ubicación</h3>
                <p className="text-sm text-gray-600">
                  {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Lugares de la ruta */}
        {route?.places?.map((place, index) => (
          <Marker
            key={place.id || index}
            position={[place.latitude, place.longitude]}
            icon={getPlaceIcon(place, index)}
            eventHandlers={{
              click: () => onPlaceSelect && onPlaceSelect(place)
            }}
          >
            <Popup>
              <div className="text-center min-w-[200px]">
                <h3 className="font-bold text-gray-800 mb-2">{place.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    place.visited 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {place.visited ? 'Visitado' : 'Pendiente'}
                  </span>
                  {place.points && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      +{place.points} pts
                    </span>
                  )}
                </div>
                {onPlaceSelect && !place.visited && (
                  <button
                    onClick={() => onPlaceSelect(place)}
                    className="mt-2 px-3 py-1 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Empezar Aventura
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Línea de la ruta */}
        {route?.places && route.places.length > 1 && (
          <Polyline
            positions={getRouteCoordinates()}
            color="#3B82F6"
            weight={3}
            opacity={0.7}
            dashArray="5, 5"
          />
        )}
      </MapContainer>
    </div>
  )
}

export default InteractiveMap
