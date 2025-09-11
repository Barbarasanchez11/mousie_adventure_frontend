import React, { useState } from 'react'
import { generateRoute, createFamily } from '@services/api/route'

// Componente para probar la conexión real con el backend
const BackendTest = () => {
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Función para añadir resultado de prueba
  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      message,
      data,
      timestamp: new Date()
    }])
  }

  // Probar conexión básica
  const testBasicConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/health')
      const data = await response.json()
      
      if (response.ok) {
        addResult('Health Check', true, 'Backend conectado correctamente', data)
      } else {
        addResult('Health Check', false, `Error ${response.status}: ${data.detail || 'Error desconocido'}`)
      }
    } catch (error) {
      addResult('Health Check', false, `Error de conexión: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Probar creación de familia
  const testCreateFamily = async () => {
    setLoading(true)
    try {
      // Intentar diferentes formatos de datos para ver cuál acepta el backend
      const familyData = {
        family_id: 'family_' + Date.now(), // Generar un ID único
        family_name: 'Familia de Prueba', // Usar family_name como espera el backend
        children: [
          { name: 'Juan', age: 8 },
          { name: 'María', age: 5 }
        ]
      }
      
      console.log('🔍 Debug Crear Familia - Enviando:', familyData)
      const response = await createFamily(familyData)
      console.log('🔍 Debug Crear Familia - Respuesta:', response)
      addResult('Crear Familia', response.success, response.message, response.data)
    } catch (error) {
      console.error('🚨 Error en Crear Familia:', error)
      addResult('Crear Familia', false, `Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Probar generación de ruta
  const testGenerateRoute = async () => {
    setLoading(true)
    try {
      const location = {
        latitude: 40.4168,
        longitude: -3.7038
      }
      const ages = [8, 5]
      
      const response = await generateRoute(location.latitude, location.longitude, ages)
      addResult('Generar Ruta', response.success, response.message, response.data)
    } catch (error) {
      addResult('Generar Ruta', false, `Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Probar aventura (ya implementada)
  const testAdventure = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/adventure/test')
      const data = await response.json()
      
      console.log('🔍 Debug Aventura Test:', { status: response.status, data })
      
      if (response.ok) {
        addResult('Aventura Test', true, 'Aventura de prueba funcionando', data)
      } else {
        // Mostrar el error específico del backend
        const errorMessage = data.detail || data.message || data.error || 'Error desconocido'
        addResult('Aventura Test', false, `Error ${response.status}: ${errorMessage}`, data)
      }
    } catch (error) {
      console.error('🚨 Error en Aventura Test:', error)
      addResult('Aventura Test', false, `Error de conexión: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Ejecutar todas las pruebas
  const runAllTests = async () => {
    setTestResults([])
    await testBasicConnection()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar 1 segundo
    await testCreateFamily()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testGenerateRoute()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testAdventure()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
        🧪 Pruebas de Conexión con Backend
      </h2>

      {/* Botones de prueba */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={testBasicConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🔍 Health Check
        </button>
        
        <button
          onClick={testCreateFamily}
          disabled={loading}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          👨‍👩‍👧‍👦 Crear Familia
        </button>
        
        <button
          onClick={testGenerateRoute}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🗺️ Generar Ruta
        </button>
        
        <button
          onClick={testAdventure}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🎭 Aventura Test
        </button>
      </div>

      {/* Botón para ejecutar todas las pruebas */}
      <div className="text-center mb-6">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white rounded-xl text-lg font-semibold transition-colors shadow-lg"
        >
          {loading ? '⏳ Ejecutando...' : '🚀 Ejecutar Todas las Pruebas'}
        </button>
      </div>

      {/* Resultados de las pruebas */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          📋 Resultados de las Pruebas:
        </h3>
        
        {testResults.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Haz clic en cualquier botón para probar la conexión con el backend
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border-2 ${
                  result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{result.test}</h4>
                  <span className={`text-2xl ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                    {result.success ? '✅' : '❌'}
                  </span>
                </div>
                <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-600 cursor-pointer">
                      Ver datos de respuesta
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {result.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BackendTest
