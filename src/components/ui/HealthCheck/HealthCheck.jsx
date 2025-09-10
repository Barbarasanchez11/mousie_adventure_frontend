import React, { useState } from 'react'
import { checkHealth } from '@services/api/health'

// Componente para verificar el estado del backend
const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState(null) // Estado del backend
  const [loading, setLoading] = useState(false) // Si está verificando
  const [error, setError] = useState(null) // Error si hay alguno

  // Función para verificar el estado del backend
  const handleHealthCheck = async () => {
    setLoading(true) // Empezamos a verificar
    setError(null) // Limpiamos errores anteriores

    try {
      const response = await checkHealth() // Llamamos a la API
      
      if (response.success) {
        setHealthStatus('OK') // Backend funcionando
      } else {
        setHealthStatus('No OK') // Backend con problemas
        setError(response.message)
      }
    } catch (error) {
      setHealthStatus('No OK') // Error de conexión
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false) // Terminamos de verificar
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleHealthCheck}
        disabled={loading}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
        )}
        <span className="text-lg sm:text-xl">🔍</span>
        <span>{loading ? 'Verificando...' : 'Verificar Backend'}</span>
      </button>

      {healthStatus && (
        <div className={`text-center p-4 rounded-xl border-2 ${
          healthStatus === 'OK' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="text-2xl sm:text-3xl mb-2">
            {healthStatus === 'OK' ? '✅' : '❌'}
          </div>
          <p className={`text-sm sm:text-base font-medium ${
            healthStatus === 'OK' ? 'text-green-800' : 'text-red-800'
          }`}>
            Backend: {healthStatus}
          </p>
          {error && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default HealthCheck
