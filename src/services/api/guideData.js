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
   * Busca con un término genérico para obtener todos los lugares
   */
  async getAllPlaces() {
    try {
      // Buscar con un término genérico que debería devolver todos los lugares
      const response = await apiRequest(`gps/places/search?query=Madrid`, 'GET')
      return {
        success: true,
        data: response.data.places || [],
        total: response.data.total || 0
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
      const response = await apiRequest(`gps/places/search?query=${encodeURIComponent(query)}`, 'GET')
      return {
        success: true,
        data: response.data.places || [],
        query: query,
        total: response.data.total || 0
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
      const response = await apiRequest(`gps/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, 'GET')
      return {
        success: true,
        data: response.data.places || [],
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
      const response = await apiRequest(`gps/places/${encodeURIComponent(placeName)}`, 'GET')
      return {
        success: true,
        data: response.data
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
      const response = await apiRequest(`gps/route?from=${encodeURIComponent(fromPlace)}&to=${encodeURIComponent(toPlace)}`, 'GET')
      return {
        success: true,
        data: response.data
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
   * Intenta obtener datos del backend primero, luego usa datos locales como fallback
   */
  async getPlacesByCategory(category) {
    try {
      // Mapeo de categorías a términos de búsqueda específicos
      const categorySearchTerms = {
        'museos': 'museo',
        'parques': 'parque',
        'teatros': 'teatro',
        'historia': 'histórico',
        'gastronomia': 'mercado'
      }

      const searchTerm = categorySearchTerms[category] || category
      
      // Buscar lugares específicos de la categoría en el backend
      const searchResponse = await this.searchPlaces(searchTerm)
      
      if (searchResponse.success && searchResponse.data.length > 0) {
        console.log(`✅ Backend devolvió ${searchResponse.data.length} lugares para categoría: ${category}`)
        return {
          success: true,
          data: searchResponse.data,
          category: category,
          total: searchResponse.data.length,
          source: 'backend'
        }
      }

      // Si no hay resultados específicos, intentar búsqueda más amplia
      console.log(`⚠️ No se encontraron lugares específicos para "${searchTerm}", intentando búsqueda más amplia...`)
      
      // Buscar con términos más generales
      const generalSearchTerms = {
        'museos': ['arte', 'cultura', 'exposición'],
        'parques': ['jardín', 'naturaleza', 'verde'],
        'teatros': ['ópera', 'cultura', 'espectáculo'],
        'historia': ['monumento', 'plaza', 'palacio'],
        'gastronomia': ['comida', 'restaurante', 'bar']
      }

      const generalTerms = generalSearchTerms[category] || [category]
      let allFoundPlaces = []

      for (const term of generalTerms) {
        const termResponse = await this.searchPlaces(term)
        if (termResponse.success && termResponse.data.length > 0) {
          allFoundPlaces.push(...termResponse.data)
        }
      }

      // Eliminar duplicados
      const uniquePlaces = allFoundPlaces.filter((place, index, self) => 
        index === self.findIndex(p => p.name === place.name)
      )

      if (uniquePlaces.length > 0) {
        console.log(`✅ Backend devolvió ${uniquePlaces.length} lugares para categoría: ${category} (búsqueda amplia)`)
        return {
          success: true,
          data: uniquePlaces,
          category: category,
          total: uniquePlaces.length,
          source: 'backend'
        }
      }

      // Si no encontramos nada en el backend, usar datos locales
      console.log(`❌ Backend no devolvió lugares para categoría: ${category}, usando datos locales`)
      return this.getLocalPlacesByCategory(category)

    } catch (error) {
      console.error('Error obteniendo lugares por categoría:', error)
      console.log(`❌ Error en backend para categoría: ${category}, usando datos locales`)
      return this.getLocalPlacesByCategory(category)
    }
  }

  /**
   * Obtener lugares locales por categoría (fallback)
   */
  getLocalPlacesByCategory(category) {
    const localPlaces = {
      'museos': [
        { 
          name: 'Museo del Prado', 
          latitude: 40.4138, 
          longitude: -3.6921, 
          description: 'Museo de arte más importante de España',
          tags: ['museo', 'arte', 'cultura'],
          challenges: ['Encuentra el cuadro de Las Meninas'],
          activities: ['Visita guiada', 'Taller de arte'],
          legends: ['El fantasma del museo'],
          magical_facts: ['Las pinturas cobran vida por la noche']
        },
        { 
          name: 'Museo Reina Sofía', 
          latitude: 40.4081, 
          longitude: -3.6946, 
          description: 'Museo de arte contemporáneo',
          tags: ['museo', 'arte', 'contemporáneo'],
          challenges: ['Descubre el Guernica de Picasso'],
          activities: ['Exposición temporal', 'Visita familiar'],
          legends: ['El museo que nunca duerme'],
          magical_facts: ['Las obras de arte hablan entre ellas']
        },
        { 
          name: 'Museo Thyssen-Bornemisza', 
          latitude: 40.4159, 
          longitude: -3.6946, 
          description: 'Colección privada de arte',
          tags: ['museo', 'arte', 'colección'],
          challenges: ['Encuentra tu pintura favorita'],
          activities: ['Audioguía', 'Visita temática'],
          legends: ['El coleccionista invisible'],
          magical_facts: ['Los cuadros cambian de lugar solos']
        }
      ],
      'parques': [
        { 
          name: 'Parque del Retiro', 
          latitude: 40.4152, 
          longitude: -3.6844, 
          description: 'Parque más famoso de Madrid',
          tags: ['parque', 'naturaleza', 'recreo'],
          challenges: ['Encuentra el Palacio de Cristal'],
          activities: ['Paseo en barca', 'Picnic familiar'],
          legends: ['El duende del Retiro'],
          magical_facts: ['Los árboles susurran secretos']
        },
        { 
          name: 'Casa de Campo', 
          latitude: 40.4189, 
          longitude: -3.7319, 
          description: 'Parque más grande de Madrid',
          tags: ['parque', 'naturaleza', 'grande'],
          challenges: ['Llega hasta el teleférico'],
          activities: ['Senderismo', 'Observación de aves'],
          legends: ['El guardián del bosque'],
          magical_facts: ['Los animales hablan con los niños']
        }
      ],
      'teatros': [
        { 
          name: 'Teatro Real', 
          latitude: 40.4180, 
          longitude: -3.7142, 
          description: 'Teatro de ópera de Madrid',
          tags: ['teatro', 'ópera', 'cultura'],
          challenges: ['Escucha una melodía mágica'],
          activities: ['Visita guiada', 'Concierto familiar'],
          legends: ['La ópera fantasma'],
          magical_facts: ['Las notas musicales flotan en el aire']
        },
        { 
          name: 'Teatro Español', 
          latitude: 40.4154, 
          longitude: -3.7074, 
          description: 'Teatro histórico de Madrid',
          tags: ['teatro', 'historia', 'cultura'],
          challenges: ['Descubre el escenario secreto'],
          activities: ['Obra de teatro', 'Taller de actuación'],
          legends: ['El actor fantasma'],
          magical_facts: ['Los actores del pasado siguen actuando']
        }
      ],
      'historia': [
        { 
          name: 'Plaza Mayor', 
          latitude: 40.4154, 
          longitude: -3.7074, 
          description: 'Plaza histórica de Madrid',
          tags: ['historia', 'plaza', 'centro'],
          challenges: ['Cuenta las ventanas de la plaza'],
          activities: ['Visita guiada', 'Mercado medieval'],
          legends: ['El fantasma de la plaza'],
          magical_facts: ['Las piedras cuentan historias']
        },
        { 
          name: 'Palacio Real', 
          latitude: 40.4180, 
          longitude: -3.7142, 
          description: 'Residencia oficial del Rey',
          tags: ['historia', 'palacio', 'rey'],
          challenges: ['Encuentra el trono real'],
          activities: ['Visita al palacio', 'Cambio de guardia'],
          legends: ['El rey fantasma'],
          magical_facts: ['Los cuadros reales cobran vida']
        }
      ],
      'gastronomia': [
        { 
          name: 'Mercado de San Miguel', 
          latitude: 40.4158, 
          longitude: -3.7072, 
          description: 'Mercado gourmet más famoso de Madrid',
          tags: ['gastronomía', 'mercado', 'comida'],
          challenges: ['Prueba un pincho de jamón ibérico'],
          activities: ['Degustación', 'Taller de cocina'],
          legends: ['El chef fantasma'],
          magical_facts: ['Los ingredientes se cocinan solos']
        }
      ]
    }

    const places = localPlaces[category] || []
    
    return {
      success: true,
      data: places,
      category: category,
      total: places.length,
      source: 'local'
    }
  }

  /**
   * Probar la conexión con el backend
   */
  async testBackendConnection() {
    try {
      console.log('🔍 Probando conexión con el backend...')
      
      // Probar health check primero
      const healthResponse = await apiRequest('health', 'GET')
      if (healthResponse.success) {
        console.log('✅ Health check exitoso')
      }
      
      // Probar búsqueda básica
      const testResponse = await this.searchPlaces('Plaza')
      
      if (testResponse.success) {
        console.log('✅ Backend conectado correctamente')
        return {
          success: true,
          message: 'Backend conectado correctamente',
          placesFound: testResponse.data.length
        }
      } else {
        console.log('❌ Backend no responde correctamente')
        return {
          success: false,
          message: 'Backend no responde correctamente'
        }
      }
    } catch (error) {
      console.log('❌ Error de conexión con el backend:', error.message)
      return {
        success: false,
        message: `Error de conexión: ${error.message}`
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
      let usingLocalData = false
      
      // Para cada categoría, obtenemos algunos lugares
      for (const category of categories) {
        const categoryPlaces = await this.getPlacesByCategory(category)
        if (categoryPlaces.success && categoryPlaces.data.length > 0) {
          // Tomamos los primeros 2-3 lugares de cada categoría
          const placesToAdd = categoryPlaces.data.slice(0, 2)
          selectedPlaces.push(...placesToAdd)
          
          // Si estamos usando datos locales, lo marcamos
          if (categoryPlaces.source === 'local') {
            usingLocalData = true
          }
        }
      }

      // Si no hay lugares, usamos datos locales de fallback
      if (selectedPlaces.length === 0) {
        console.log('No se encontraron lugares, usando datos de fallback')
        return this.getFallbackRoute(categories, startLocation, childrenAges)
      }

      // Generamos la ruta
      const route = {
        route_id: `custom_${categories.join('_')}_${Date.now()}`,
        name: `Ruta Personalizada: ${categories.join(', ')}`,
        description: `Una ruta personalizada que incluye ${categories.join(', ')}${usingLocalData ? ' (datos locales)' : ''}`,
        categories: categories,
        total_places: selectedPlaces.length,
        estimated_duration: `${Math.ceil(selectedPlaces.length * 0.5)}-${Math.ceil(selectedPlaces.length * 0.8)} horas`,
        difficulty: 'Personalizada',
        source: usingLocalData ? 'local' : 'backend',
        places: selectedPlaces.map((place, index) => ({
          id: place.name || `place_${index}`,
          name: place.name || `Lugar ${index + 1}`,
          latitude: place.latitude,
          longitude: place.longitude,
          description: place.description || 'Lugar de interés',
          type: index === 0 ? 'start' : index === selectedPlaces.length - 1 ? 'end' : 'place',
          challenge: place.challenges && place.challenges[0] || `Desafío en ${place.name}`,
          reward: `Recompensa por visitar ${place.name}`,
          category: place.tags ? place.tags[0] : 'general',
          legends: place.legends || [],
          magical_facts: place.magical_facts || [],
          activities: place.activities || []
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
