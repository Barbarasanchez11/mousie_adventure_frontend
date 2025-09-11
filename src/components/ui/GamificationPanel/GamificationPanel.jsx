import React, { useState, useEffect } from 'react'
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay'
import AchievementBadge from '../AchievementBadge/AchievementBadge'
import { simulatePoints } from '@services/api/gamification'


const GamificationPanel = () => {
  const [points, setPoints] = useState(0) 
  const [coins, setCoins] = useState(0) 
  const [showAnimation, setShowAnimation] = useState(false) 
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


  const earnPoints = () => {
    const newPoints = simulatePoints()
    
   
    setShowAnimation(true)
    
   
    setPoints(prev => prev + newPoints.points)
    setCoins(prev => prev + newPoints.coins)
    
  
    checkAchievements(points + newPoints.points, coins + newPoints.coins)
    
   
    setTimeout(() => {
      setShowAnimation(false)
    }, 2000)
  }

 
  const checkAchievements = (totalPoints, totalCoins) => {
    setAchievements(prev => prev.map(achievement => {
      let shouldUnlock = false
      
      switch (achievement.id) {
        case 1: 
          shouldUnlock = totalPoints >= 25
          break
        case 2:
          shouldUnlock = totalPoints >= 50
          break
        case 3:
          shouldUnlock = totalPoints >= 30
          break
        case 4:
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
