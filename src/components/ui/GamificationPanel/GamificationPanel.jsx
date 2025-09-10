import React, { useState, useEffect } from 'react'
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay'
import AchievementBadge from '../AchievementBadge/AchievementBadge'
import { simulatePoints } from '@services/api/gamification'

// Componente principal de gamificación
const GamificationPanel = () => {
  const [points, setPoints] = useState(0) // Puntos totales
  const [coins, setCoins] = useState(0) // Monedas totales
  const [showAnimation, setShowAnimation] = useState(false) // Animación de puntos
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Primera Aventura',
      description: 'Completa tu primera aventura con el Ratoncito Pérez',
      icon: '🐭',
      isUnlocked: false,
      points: 25
    },
    {
      id: 2,
      title: 'Explorador Madrid',
      description: 'Visita 3 lugares diferentes en Madrid',
      icon: '🏛️',
      isUnlocked: false,
      points: 50
    },
    {
      id: 3,
      title: 'Preguntón Curioso',
      description: 'Haz 5 preguntas al Ratoncito Pérez',
      icon: '❓',
      isUnlocked: false,
      points: 30
    },
    {
      id: 4,
      title: 'Coleccionista de Monedas',
      description: 'Reúne 10 monedas mágicas',
      icon: '🪙',
      isUnlocked: false,
      points: 75
    }
  ])

  // Función para simular ganar puntos
  const earnPoints = () => {
    const newPoints = simulatePoints()
    
    // Mostrar animación
    setShowAnimation(true)
    
    // Actualizar puntos y monedas
    setPoints(prev => prev + newPoints.points)
    setCoins(prev => prev + newPoints.coins)
    
    // Verificar logros desbloqueados
    checkAchievements(points + newPoints.points, coins + newPoints.coins)
    
    // Quitar animación después de 2 segundos
    setTimeout(() => {
      setShowAnimation(false)
    }, 2000)
  }

  // Función para verificar logros
  const checkAchievements = (totalPoints, totalCoins) => {
    setAchievements(prev => prev.map(achievement => {
      let shouldUnlock = false
      
      switch (achievement.id) {
        case 1: // Primera Aventura
          shouldUnlock = totalPoints >= 25
          break
        case 2: // Explorador Madrid
          shouldUnlock = totalPoints >= 50
          break
        case 3: // Preguntón Curioso
          shouldUnlock = totalPoints >= 30
          break
        case 4: // Coleccionista de Monedas
          shouldUnlock = totalCoins >= 10
          break
        default:
          shouldUnlock = false
      }
      
      return {
        ...achievement,
        isUnlocked: achievement.isUnlocked || shouldUnlock
      }
    }))
  }

  // Simular puntos iniciales al cargar
  useEffect(() => {
    const initialPoints = simulatePoints()
    setPoints(initialPoints.points)
    setCoins(initialPoints.coins)
  }, [])

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          🏆 Tu Progreso
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Puntos y logros de tu aventura
        </p>
      </div>

      {/* Puntos y Monedas */}
      <ScoreDisplay 
        points={points}
        coins={coins}
        showAnimation={showAnimation}
      />

      {/* Botón para simular puntos */}
      <div className="text-center">
        <button
          onClick={earnPoints}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          🎯 Simular Puntos
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Haz clic para ganar puntos y monedas
        </p>
      </div>

      {/* Logros */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
          🏅 Logros
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              isUnlocked={achievement.isUnlocked}
              points={achievement.points}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GamificationPanel
