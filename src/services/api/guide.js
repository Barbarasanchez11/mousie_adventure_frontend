import { apiRequest } from './config.js'


class GuideService {
  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  }

  async getNextRoute(currentPlace, childrenAges) {
    try {
      const response = await apiRequest('guide/next-route', 'POST', {
        current_place: currentPlace,
        children_ages: childrenAges
      })
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al obtener la siguiente ruta')
    } catch (error) {
      console.error('Error al obtener la siguiente ruta:', error)
      throw error
    }
  }

  
  async getNavigationGuide(currentPlace, nextPlace, childrenAges) {
    try {
      const response = await apiRequest('guide/navigation', 'POST', {
        current_place: currentPlace,
        next_place: nextPlace,
        children_ages: childrenAges
      })
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al obtener la guía de navegación')
    } catch (error) {
      console.error('Error al obtener la guía de navegación:', error)
      throw error
    }
  }

 
  async getAvailablePlaces() {
    try {
      const response = await apiRequest('guide/places', 'GET')
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al obtener los lugares disponibles')
    } catch (error) {
      console.error('Error al obtener los lugares disponibles:', error)
      throw error
    }
  }


  async getMadridRoute(childrenAges) {
    try {
      const response = await apiRequest('guide/madrid-route', 'POST', {
        children_ages: childrenAges
      })
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al obtener la ruta de Madrid')
    } catch (error) {
      console.error('Error al obtener la ruta de Madrid:', error)
      throw error
    }
  }


  async markPlaceVisited(placeName, childrenAges) {
    try {
      const response = await apiRequest('guide/visit-place', 'POST', {
        place_name: placeName,
        children_ages: childrenAges
      })
      
      if (response.success) {
        return response
      }
      throw new Error(response.message || 'Error al marcar lugar como visitado')
    } catch (error) {
      console.error('Error al marcar lugar como visitado:', error)
      throw error
    }
  }
}

export const guideService = new GuideService()
