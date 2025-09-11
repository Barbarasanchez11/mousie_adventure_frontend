import React, { useState, useEffect } from 'react'
import { challengeService } from '@services/api/challenge'

const ChallengeModal = ({ 
  isOpen, 
  onClose, 
  place, 
  childrenAges = [6, 8], 
  onChallengeComplete 
}) => {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showStory, setShowStory] = useState(true) // Mostrar historia primero
  const [acceptedChallenge, setAcceptedChallenge] = useState(false) // Usuario aceptó el reto

  // Generar desafío cuando se abre el modal
  useEffect(() => {
    if (isOpen && place) {
      generateChallenge()
    }
  }, [isOpen, place])

  const generateChallenge = async () => {
    if (!place) return

    setLoading(true)
    setError(null)
    setShowResult(false)
    setUserAnswer('')

    try {
      const response = await challengeService.generateChallenge(
        place.name,
        childrenAges,
        {
          latitude: place.latitude || 40.4168,
          longitude: place.longitude || -3.7038,
          activities: place.activities || [],
          challenges: place.challenges || [],
          magical_facts: place.magical_facts || [],
          year_built: place.year_built || '',
          architect: place.architect || '',
          district: place.district || '',
          tags: place.tags || []
        }
      )

      if (response.success) {
        setChallenge(response.data)
      } else {
        throw new Error(response.message || 'Error generando desafío')
      }
    } catch (err) {
      console.error('Error generando desafío:', err)
      setError('No se pudo generar el desafío. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!challenge || !userAnswer.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await challengeService.validateChallenge(
        place.name,
        challenge.challenge,
        { answer: userAnswer.trim() }
      )

      if (response.success) {
        setResult(response.data)
        setShowResult(true)
        
        if (onChallengeComplete) {
          onChallengeComplete({
            place: place,
            challenge: challenge.challenge,
            userAnswer: userAnswer.trim(),
            result: response.data
          })
        }
      } else {
        throw new Error(response.message || 'Error validando respuesta')
      }
    } catch (err) {
      console.error('Error validando respuesta:', err)
      setError('No se pudo validar la respuesta. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setChallenge(null)
    setUserAnswer('')
    setShowResult(false)
    setResult(null)
    setError(null)
    setShowStory(true)
    setAcceptedChallenge(false)
    onClose()
  }

  const handleNewChallenge = () => {
    setShowStory(true)
    setAcceptedChallenge(false)
    setUserAnswer('')
    setShowResult(false)
    setResult(null)
    generateChallenge()
  }

  const handleAcceptChallenge = () => {
    setAcceptedChallenge(true)
    setShowStory(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                🐭
              </div>
              <div>
                <h2 className="text-2xl font-bold">Desafío del Ratoncito Pérez</h2>
                <p className="text-purple-100">{place?.name}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && !challenge && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generando desafío mágico...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={generateChallenge}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* FASE 1: HISTORIA DEL RATONCITO PÉREZ */}
          {challenge && showStory && !acceptedChallenge && (
            <div className="space-y-6">
              {/* Story from Backend */}
              {challenge.story && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl animate-bounce">🐭</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-4 text-lg">Historia del Ratoncito Pérez</h3>
                      <div className="max-h-64 overflow-y-auto pr-2 story-scroll">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {challenge.story}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón para aceptar el reto */}
              <div className="text-center">
                <button
                  onClick={handleAcceptChallenge}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ¿Aceptas el reto? 🎯
                </button>
              </div>
            </div>
          )}

          {/* FASE 2: DESAFÍO ACEPTADO */}
          {challenge && acceptedChallenge && !showResult && (
            <div className="space-y-6">
              {/* Challenge Info */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 animate-slide-in-right">
                <div className="flex items-start gap-3">
                  <span className="text-2xl animate-pulse-glow">🎯</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">Tu Desafío</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {challenge.challenge}
                    </p>
                  </div>
                </div>
              </div>

              {/* Challenge Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-600">⏱️</span>
                    <span className="text-sm font-medium text-blue-800">Tiempo</span>
                  </div>
                  <p className="text-sm text-blue-700">{challenge.estimated_time}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600">🎚️</span>
                    <span className="text-sm font-medium text-green-800">Dificultad</span>
                  </div>
                  <p className="text-sm text-green-700">{challenge.difficulty}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-600">🏆</span>
                    <span className="text-sm font-medium text-purple-800">Recompensas</span>
                  </div>
                  <p className="text-sm text-purple-700">{challenge.rewards.length} tesoros</p>
                </div>
              </div>

              {/* User Input */}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700 font-medium mb-2 block">
                    ¿Qué has descubierto? Cuéntame tu respuesta:
                  </span>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Escribe aquí lo que has encontrado o descubierto..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={loading || !userAnswer.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? 'Validando...' : 'Enviar Respuesta'}
                  </button>
                  <button
                    onClick={handleNewChallenge}
                    disabled={loading}
                    className="bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Nuevo Desafío
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResult && result && (
            <div className="space-y-6">
              {/* Result Header */}
              <div className={`text-center py-6 rounded-xl ${
                result.is_correct 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="text-6xl mb-4">
                  {result.is_correct ? '🎉' : '🤔'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  result.is_correct ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {result.is_correct ? '¡Excelente!' : '¡Buen intento!'}
                </h3>
                <p className={`text-lg ${
                  result.is_correct ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {result.feedback}
                </p>
                {result.score > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Puntuación: {result.score} puntos
                  </p>
                )}
              </div>

              {/* Rewards from Backend */}
              {result.is_correct && challenge && challenge.reward && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>🏆</span>
                    Recompensa del Ratoncito Pérez
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {challenge.reward}
                  </p>
                </div>
              )}

              {/* Additional Rewards */}
              {result.is_correct && challenge && challenge.rewards && challenge.rewards.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>✨</span>
                    Tesoros Adicionales
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {challenge.rewards.map((reward, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <span>💎</span>
                        <span>{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Continuar Aventura
                </button>
                <button
                  onClick={handleNewChallenge}
                  className="bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Nuevo Desafío
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChallengeModal
