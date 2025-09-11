import { apiRequest } from './config.js'

/**
 * Servicio para acceder a datos de guías del backend
 * Conecta con los endpoints GPS del backend
 */
class GuideDataService {
  constructor() {
    this.baseURL = '/gps'
  }

  /**
   * Obtener todos los lugares disponibles
   */
  async getAllPlaces() {
    try {
      const response = await apiRequest(`${this.baseURL}/places`, 'GET')
      return {
        success: true,
        data: response.places || [],
        total: response.total || 0
      }
    } catch (error) {
      console.error('Error obteniendo todos los lugares:', error)
      return {
        success: false,
        message: 'No se pudieron obtener los lugares del backend',
        data: []
      }
    }
  }

  /**
   * Buscar lugares por nombre
   */
  async searchPlaces(query) {
    try {
      const response = await apiRequest(`${this.baseURL}/places/search?query=${encodeURIComponent(query)}`, 'GET')
      return {
        success: true,
        data: response.places || [],
        query: query,
        total: response.total || 0
      }
    } catch (error) {
      console.error('Error buscando lugares:', error)
      return {
        success: false,
        message: `No se pudieron buscar lugares para "${query}"`,
        data: []
      }
    }
  }

  /**
   * Obtener lugares cercanos a una ubicación
   */
  async getNearbyPlaces(lat, lng, radius = 1000) {
    try {
      const response = await apiRequest(`${this.baseURL}/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, 'GET')
      return {
        success: true,
        data: response.places || [],
        center: { lat, lng },
        radius: radius
      }
    } catch (error) {
      console.error('Error obteniendo lugares cercanos:', error)
      return {
        success: false,
        message: 'No se pudieron obtener lugares cercanos',
        data: []
      }
    }
  }

  /**
   * Obtener detalles de un lugar específico
   */
  async getPlaceDetails(placeName) {
    try {
      const response = await apiRequest(`${this.baseURL}/places/${encodeURIComponent(placeName)}`, 'GET')
      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Error obteniendo detalles del lugar:', error)
      return {
        success: false,
        message: `No se pudieron obtener detalles de "${placeName}"`,
        data: null
      }
    }
  }

  /**
   * Obtener ruta entre dos lugares
   */
  async getRoute(fromPlace, toPlace) {
    try {
      const response = await apiRequest(`${this.baseURL}/route?from=${encodeURIComponent(fromPlace)}&to=${encodeURIComponent(toPlace)}`, 'GET')
      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Error obteniendo ruta:', error)
      return {
        success: false,
        message: `No se pudo obtener la ruta de "${fromPlace}" a "${toPlace}"`,
        data: null
      }
    }
  }

  /**
   * Obtener lugares por categoría/tema
   */
  async getPlacesByCategory(category) {
    try {
      // Primero obtenemos todos los lugares
      const allPlaces = await this.getAllPlaces()
      
      if (!allPlaces.success) {
        return allPlaces
      }

      // Filtramos por categoría usando los tags
      const filteredPlaces = allPlaces.data.filter(place => 
        place.tags && place.tags.some(tag => 
          tag.toLowerCase().includes(category.toLowerCase())
        )
      )

      return {
        success: true,
        data: filteredPlaces,
        category: category,
        total: filteredPlaces.length
      }
    } catch (error) {
      console.error('Error obteniendo lugares por categoría:', error)
      return {
        success: false,
        message: `No se pudieron obtener lugares de la categoría "${category}"`,
        data: []
      }
    }
  }

  /**
   * Obtener rutas temáticas predefinidas
   */
  async getThematicRoutes() {
    try {
      // Definimos las rutas temáticas disponibles
      const thematicRoutes = {
        'museos': {
          name: 'Ruta de Museos',
          description: 'Descubre los museos más importantes de Madrid',
          icon: '🏛️',
          color: '#8B5CF6',
          places: [
            'Museo del Prado',
            'Museo Reina Sofía',
            'Museo Thyssen-Bornemisza',
            'Museo Arqueológico Nacional',
            'Museo de Ciencias Naturales'
          ]
        },
        'parques': {
          name: 'Ruta de Parques',
          description: 'Explora los parques y jardines de Madrid',
          icon: '🌳',
          color: '#10B981',
          places: [
            'Parque del Retiro',
            'Parque de El Capricho',
            'Casa de Campo',
            'Parque del Oeste',
            'Jardín Botánico'
          ]
        },
        'teatros': {
          name: 'Ruta de Teatros',
          description: 'Conoce los teatros históricos de Madrid',
          icon: '🎭',
          color: '#F59E0B',
          places: [
            'Teatro Real',
            'Teatro de la Zarzuela',
            'Teatro Español',
            'Teatro de la Comedia',
            'Teatro Lara'
          ]
        },
        'historia': {
          name: 'Ruta Histórica',
          description: 'Recorre los lugares más históricos de Madrid',
          icon: '🏰',
          color: '#EF4444',
          places: [
            'Plaza Mayor',
            'Puerta del Sol',
            'Palacio Real',
            'Catedral de la Almudena',
            'Plaza de Oriente'
          ]
        },
        'gastronomia': {
          name: 'Ruta Gastronómica',
          description: 'Saborea la mejor gastronomía de Madrid',
          icon: '🍽️',
          color: '#F97316',
          places: [
            'Mercado de San Miguel',
            'Mercado de San Antón',
            'Mercado de la Cebada',
            'Plaza de Santa Ana',
            'Calle de la Cava Baja'
          ]
        }
      }

      return {
        success: true,
        data: thematicRoutes
      }
    } catch (error) {
      console.error('Error obteniendo rutas temáticas:', error)
      return {
        success: false,
        message: 'No se pudieron obtener las rutas temáticas',
        data: {}
      }
    }
  }

  /**
   * Generar ruta personalizada basada en categorías
   */
  async generateCustomRoute(categories, startLocation, childrenAges = [5, 8]) {
    try {
      const selectedPlaces = []
      
      // Para cada categoría, obtenemos algunos lugares
      for (const category of categories) {
        const categoryPlaces = await this.getPlacesByCategory(category)
        if (categoryPlaces.success && categoryPlaces.data.length > 0) {
          // Tomamos los primeros 2-3 lugares de cada categoría
          const placesToAdd = categoryPlaces.data.slice(0, 2)
          selectedPlaces.push(...placesToAdd)
        }
      }

      // Si no hay lugares del backend, usamos datos locales
      if (selectedPlaces.length === 0) {
        return this.getFallbackRoute(categories, startLocation, childrenAges)
      }

      // Generamos la ruta
      const route = {
        route_id: `custom_${categories.join('_')}_${Date.now()}`,
        name: `Ruta Personalizada: ${categories.join(', ')}`,
        description: `Una ruta personalizada que incluye ${categories.join(', ')}`,
        categories: categories,
        total_places: selectedPlaces.length,
        estimated_duration: `${Math.ceil(selectedPlaces.length * 0.5)}-${Math.ceil(selectedPlaces.length * 0.8)} horas`,
        difficulty: 'Personalizada',
        places: selectedPlaces.map((place, index) => ({
          id: place.name || `place_${index}`,
          name: place.name || `Lugar ${index + 1}`,
          latitude: place.latitude,
          longitude: place.longitude,
          description: place.description || 'Lugar de interés',
          type: index === 0 ? 'start' : index === selectedPlaces.length - 1 ? 'end' : 'place',
          challenge: place.challenges && place.challenges[0] || `Desafío en ${place.name}`,
          reward: `Recompensa por visitar ${place.name}`,
          category: place.tags ? place.tags[0] : 'general'
        }))
      }

      return {
        success: true,
        data: route
      }
    } catch (error) {
      console.error('Error generando ruta personalizada:', error)
      return this.getFallbackRoute(categories, startLocation, childrenAges)
    }
  }

  /**
   * Ruta de fallback con datos locales
   */
  getFallbackRoute(categories, startLocation, childrenAges) {
    // Datos locales de fallback
    const fallbackPlaces = {
      'museos': [
        { name: 'Museo del Prado', lat: 40.4138, lng: -3.6921, description: 'Museo de arte más importante de España' },
        { name: 'Museo Reina Sofía', lat: 40.4081, lng: -3.6946, description: 'Museo de arte contemporáneo' }
      ],
      'parques': [
        { name: 'Parque del Retiro', lat: 40.4152, lng: -3.6844, description: 'Parque más famoso de Madrid' },
        { name: 'Casa de Campo', lat: 40.4189, lng: -3.7319, description: 'Parque más grande de Madrid' }
      ],
      'teatros': [
        { name: 'Teatro Real', lat: 40.4180, lng: -3.7142, description: 'Teatro de ópera de Madrid' },
        { name: 'Teatro Español', lat: 40.4154, lng: -3.7074, description: 'Teatro histórico de Madrid' }
      ]
    }

    const selectedPlaces = []
    categories.forEach(category => {
      if (fallbackPlaces[category]) {
        selectedPlaces.push(...fallbackPlaces[category])
      }
    })

    return {
      success: true,
      data: {
        route_id: `fallback_${categories.join('_')}_${Date.now()}`,
        name: `Ruta Local: ${categories.join(', ')}`,
        description: `Ruta generada con datos locales para ${categories.join(', ')}`,
        categories: categories,
        total_places: selectedPlaces.length,
        estimated_duration: `${Math.ceil(selectedPlaces.length * 0.5)}-${Math.ceil(selectedPlaces.length * 0.8)} horas`,
        difficulty: 'Fácil',
        places: selectedPlaces.map((place, index) => ({
          id: place.name || `place_${index}`,
          name: place.name || `Lugar ${index + 1}`,
          latitude: place.lat,
          longitude: place.lng,
          description: place.description || 'Lugar de interés',
          type: index === 0 ? 'start' : index === selectedPlaces.length - 1 ? 'end' : 'place',
          challenge: `Desafío en ${place.name}`,
          reward: `Recompensa por visitar ${place.name}`,
          category: categories[0] || 'general'
        }))
      }
    }
  }
}

export const guideDataService = new GuideDataService()
