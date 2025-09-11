import { useState } from 'react'


export const useGeolocation = () => {
  const [location, setLocation] = useState(null) /
  const [loading, setLoading] = useState(false) 
  const [error, setError] = useState(null)

  
  const isSupported = 'geolocation' in navigator

  
  const getLocation = () => {
   
    if (!isSupported) {
      setError('Tu navegador no soporta geolocalización')
      return
    }

    setLoading(true)
    setError(null)

  
    navigator.geolocation.getCurrentPosition(
      (position) => {
       
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLoading(false) 
      },
      (error) => {
        
        setError('No se pudo obtener la ubicación')
        setLoading(false) 
        console.error('Error de geolocalización:', error)
      }
    )
  }

  return {
    location,
    loading,
    error,
    getLocation,
    isSupported,
  }
}
