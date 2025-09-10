import { useState } from 'react'

// Hook para obtener la ubicación del usuario de forma sencilla
export const useGeolocation = () => {
  const [location, setLocation] = useState(null) // Guarda la latitud y longitud
  const [loading, setLoading] = useState(false) // Indica si se está buscando la ubicación
  const [error, setError] = useState(null) // Guarda cualquier error que ocurra

  // Comprueba si el navegador soporta la geolocalización
  const isSupported = 'geolocation' in navigator

  // Función para obtener la ubicación actual
  const getLocation = () => {
    // Si el navegador no lo soporta, muestra un error
    if (!isSupported) {
      setError('Tu navegador no soporta geolocalización')
      return
    }

    setLoading(true) // Empezamos a cargar
    setError(null) // Limpiamos errores anteriores

    // Pide la ubicación al navegador
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Si tiene éxito, guarda la ubicación
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLoading(false) // Terminamos de cargar
      },
      (error) => {
        // Si hay un error, lo guarda y lo muestra
        setError('No se pudo obtener la ubicación')
        setLoading(false) // Terminamos de cargar
        console.error('Error de geolocalización:', error)
      }
    )
  }

  // Devuelve la ubicación, si está cargando, el error y la función para obtener la ubicación
  return {
    location,
    loading,
    error,
    getLocation,
    isSupported,
  }
}
