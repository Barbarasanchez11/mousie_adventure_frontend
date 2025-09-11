import { apiRequest } from './config.js'


class RatoncitoAdventure {
  constructor() {
    this.apiBase = 'http://localhost:8000'
    this.currentLocation = null
    this.currentRoute = null
    this.familyId = null
  }


  async generateRoute(lat, lng, ages) {
    try {
      const response = await apiRequest('adventure/route/generate', 'POST', {
        latitude: lat,
        longitude: lng,
        children_ages: ages
      })
      
      if (response.success) {
        this.currentRoute = response.data
        return response
      }
      throw new Error(response.message || 'Error al generar ruta')
    } catch (error) {
      console.error('Error al generar ruta:', error)
      throw error
    }
  }

 
  async startAdventureAtPlace(lat, lng, ages) {
    try {
      const response = await apiRequest('adventure/start', 'POST', {
        latitude: lat,
        longitude: lng,
        children_ages: ages
      })
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al iniciar aventura')
    } catch (error) {
      console.error('Error al iniciar aventura:', error)
      throw error
    }
  }


  async completeChallenge(placeName, points = 25) {
    if (!this.familyId) {
      throw new Error('No hay familia creada')
    }

    try {
      const response = await apiRequest(`gamification/family/${this.familyId}/visit-place`, 'POST', {
        place_name: placeName,
        points: points
      })
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al completar desafío')
    } catch (error) {
      console.error('Error al completar desafío:', error)
      throw error
    }
  }

 
  async getNextPlace(routeId, currentPlace) {
    try {
      const response = await apiRequest(`adventure/route/${routeId}/next?current_place=${currentPlace}`)
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al obtener siguiente lugar')
    } catch (error) {
      console.error('Error al obtener siguiente lugar:', error)
      throw error
    }
  }


  async createFamily(familyData) {
    try {
      const response = await apiRequest('gamification/family/create', 'POST', familyData)
      
      if (response.success) {
        this.familyId = response.data.family_id
        return response
      }
      throw new Error(response.message || 'Error al crear familia')
    } catch (error) {
      console.error('Error al crear familia:', error)
    
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  }

  
  async getFamilyStats() {
    if (!this.familyId) {
      throw new Error('No hay familia creada')
    }

    try {
      const response = await apiRequest(`gamification/family/${this.familyId}/stats`)
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al obtener estadísticas')
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      throw error
    }
  }
}


const adventureAPI = new RatoncitoAdventure()


export const generateRoute = (lat, lng, ages) => adventureAPI.generateRoute(lat, lng, ages)
export const startAdventureAtPlace = (lat, lng, ages) => adventureAPI.startAdventureAtPlace(lat, lng, ages)
export const completeChallenge = (placeName, points) => adventureAPI.completeChallenge(placeName, points)
export const getNextPlace = (routeId, currentPlace) => adventureAPI.getNextPlace(routeId, currentPlace)
export const createFamily = (familyData) => adventureAPI.createFamily(familyData)
export const getFamilyStats = () => adventureAPI.getFamilyStats()


export default adventureAPI
