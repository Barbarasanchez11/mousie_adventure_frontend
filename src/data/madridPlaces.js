export const MADRID_PLACES = {
  "Plaza Mayor": {
    id: "plaza_mayor",
    name: "Plaza Mayor",
    latitude: 40.4154,
    longitude: -3.7074,
    type: "start",
    description: "La famosa plaza rectangular de Madrid, corazón histórico de la ciudad",
    cultural_significance: "Plaza principal de Madrid desde el siglo XVII, lugar de mercados y festividades",
    district: "Centro",
    tags: ["histórico", "arquitectura", "turismo"],
    challenge: "Busca la estatua de Felipe III en el centro de la plaza",
    reward: "10 puntos y 2 monedas mágicas",
    time_estimate: "15-20 minutos"
  },
  "Puerta del Sol": {
    id: "puerta_del_sol",
    name: "Puerta del Sol",
    latitude: 40.4168,
    longitude: -3.7038,
    type: "checkpoint",
    description: "El kilómetro cero de España y centro neurálgico de Madrid",
    cultural_significance: "Punto de partida de todas las carreteras radiales de España",
    district: "Centro",
    tags: ["kilómetro cero", "comercio", "transporte"],
    challenge: "Encuentra el reloj de la Casa de Correos y cuenta las campanadas",
    reward: "15 puntos y 3 monedas mágicas",
    time_estimate: "20-25 minutos"
  },
  "Palacio Real": {
    id: "palacio_real",
    name: "Palacio Real",
    latitude: 40.4180,
    longitude: -3.7142,
    type: "checkpoint",
    description: "Residencia oficial del Rey de España, uno de los palacios más grandes de Europa",
    cultural_significance: "Sede de la monarquía española desde el siglo XVIII",
    district: "Centro",
    tags: ["monarquía", "arquitectura", "historia"],
    challenge: "Observa los jardines del Campo del Moro desde la plaza",
    reward: "20 puntos y 4 monedas mágicas",
    time_estimate: "25-30 minutos"
  },
  "Parque del Retiro": {
    id: "parque_retiro",
    name: "Parque del Retiro",
    latitude: 40.4150,
    longitude: -3.6840,
    type: "checkpoint",
    description: "Uno de los parques más famosos de Madrid, con el Palacio de Cristal",
    cultural_significance: "Antiguo jardín real, ahora parque público desde el siglo XIX",
    district: "Retiro",
    tags: ["naturaleza", "arte", "recreo"],
    challenge: "Encuentra el Palacio de Cristal y haz una foto",
    reward: "18 puntos y 3 monedas mágicas",
    time_estimate: "30-40 minutos"
  },
  "Templo de Debod": {
    id: "templo_debod",
    name: "Templo de Debod",
    latitude: 40.4240,
    longitude: -3.7178,
    type: "checkpoint",
    description: "Templo egipcio del siglo II a.C. regalado a España por Egipto",
    cultural_significance: "Único templo egipcio en España, regalo por la ayuda en la construcción de la presa de Asuán",
    district: "Moncloa-Aravaca",
    tags: ["egipcio", "historia", "único"],
    challenge: "Observa el atardecer desde el templo",
    reward: "25 puntos y 5 monedas mágicas",
    time_estimate: "20-25 minutos"
  },
  "Gran Vía": {
    id: "gran_via",
    name: "Gran Vía",
    latitude: 40.4200,
    longitude: -3.7050,
    type: "checkpoint",
    description: "La calle más famosa de Madrid, conocida como el Broadway madrileño",
    cultural_significance: "Arteria principal de Madrid, símbolo de la modernidad del siglo XX",
    district: "Centro",
    tags: ["comercio", "teatro", "arquitectura"],
    challenge: "Cuenta cuántos teatros puedes ver en la Gran Vía",
    reward: "12 puntos y 2 monedas mágicas",
    time_estimate: "15-20 minutos"
  },
  "Mercado de San Miguel": {
    id: "mercado_san_miguel",
    name: "Mercado de San Miguel",
    latitude: 40.4158,
    longitude: -3.7072,
    type: "checkpoint",
    description: "Mercado gourmet más famoso de Madrid, con productos de alta calidad",
    cultural_significance: "Mercado histórico renovado, ejemplo de la gastronomía española",
    district: "Centro",
    tags: ["gastronomía", "mercado", "tradición"],
    challenge: "Prueba un pincho de jamón ibérico",
    reward: "8 puntos y 1 moneda mágica",
    time_estimate: "10-15 minutos"
  }
}

// Rutas predefinidas entre lugares
export const MADRID_ROUTES = {
  "Plaza Mayor": ["Puerta del Sol", "Mercado de San Miguel"],
  "Puerta del Sol": ["Plaza Mayor", "Palacio Real", "Parque del Retiro"],
  "Palacio Real": ["Puerta del Sol", "Templo de Debod"],
  "Parque del Retiro": ["Puerta del Sol", "Gran Vía"],
  "Templo de Debod": ["Palacio Real", "Gran Vía"],
  "Gran Vía": ["Parque del Retiro", "Templo de Debod"],
  "Mercado de San Miguel": ["Plaza Mayor"]
}

// Función para obtener lugares en formato para el mapa
export const getMadridPlacesForMap = () => {
  return Object.values(MADRID_PLACES).map(place => ({
    ...place,
    latitude: place.latitude,
    longitude: place.longitude
  }))
}

// Función para obtener rutas en formato para el mapa
export const getMadridRoutesForMap = () => {
  const routes = []
  
  Object.entries(MADRID_ROUTES).forEach(([fromPlace, toPlaces]) => {
    const fromPlaceData = MADRID_PLACES[fromPlace]
    toPlaces.forEach(toPlace => {
      const toPlaceData = MADRID_PLACES[toPlace]
      routes.push({
        from: fromPlaceData,
        to: toPlaceData,
        coordinates: [
          [fromPlaceData.latitude, fromPlaceData.longitude],
          [toPlaceData.latitude, toPlaceData.longitude]
        ]
      })
    })
  })
  
  return routes
}


export const getRouteBetweenPlaces = (fromPlace, toPlace) => {
  const fromPlaceData = MADRID_PLACES[fromPlace]
  const toPlaceData = MADRID_PLACES[toPlace]
  
  if (!fromPlaceData || !toPlaceData) {
    return null
  }
  
  return {
    from: fromPlaceData,
    to: toPlaceData,
    coordinates: [
      [fromPlaceData.latitude, fromPlaceData.longitude],
      [toPlaceData.latitude, toPlaceData.longitude]
    ]
  }
}
