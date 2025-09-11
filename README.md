# 🐭 Ratoncito Pérez Adventure - Frontend

**La aventura familiar con el Ratoncito Pérez en Madrid** - Una experiencia interactiva para toda la familia que combina turismo, tecnología y diversión.

## 🎯 Descripción del Proyecto

Este es el frontend de la aplicación "Ratoncito Pérez Adventure", desarrollado con React y Vite. La aplicación permite a las familias vivir una aventura interactiva por Madrid, ayudando al Ratoncito Pérez a recuperar monedas mágicas perdidas en diferentes lugares emblemáticos de la ciudad.

### 🚀 Características Principales

- **🗺️ Mapa Interactivo**: Navegación por lugares de Madrid con Google Maps
- **🎮 Aventuras Gamificadas**: Retos y actividades para toda la familia
- **📍 Geolocalización**: Detección automática de ubicación
- **🎨 Diseño Responsivo**: Optimizado para móviles y desktop
- **⚡ Performance**: Carga rápida con lazy loading y code splitting

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **React Query** - Manejo de estado del servidor
- **Tailwind CSS** - Estilos y diseño
- **Google Maps** - Mapas interactivos
- **Framer Motion** - Animaciones


## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de interfaz (Button, Card, Modal, etc.)
│   ├── layout/         # Componentes de layout (Header, Footer, Navigation)
│   └── common/         # Componentes comunes (Loading, Error, etc.)
├── pages/              # Páginas principales de la aplicación
│   ├── home/           # Página de inicio
│   ├── map/            # Página del mapa interactivo
│   ├── adventure/      # Página de aventura
│   └── profile/        # Página de perfil de usuario
├── features/           # Funcionalidades específicas del dominio
│   ├── adventure/      # Lógica de aventuras
│   ├── map/            # Funcionalidad del mapa
│   ├── story/          # Sistema de historias
│   ├── rewards/        # Sistema de recompensas
│   └── location/       # Gestión de ubicaciones
├── services/           # Servicios y APIs
│   ├── api/            # Servicios de API por dominio
│   └── location/       # Servicios de geolocalización
├── hooks/              # Custom hooks
├── types/              # Definiciones de tipos (JSDoc)
├── utils/              # Utilidades y helpers
├── contexts/           # Contextos de React
├── assets/             # Recursos estáticos
│   ├── images/         # Imágenes organizadas por categoría
│   ├── icons/          # Iconos del sistema
│   ├── sounds/         # Audio y música
│   └── animations/     # Animaciones y efectos
├── styles/             # Estilos CSS/SCSS
└── config/             # Configuraciones
```

## ⚙️ Configuración del Proyecto

### Archivos de Configuración

**En la raíz del proyecto:**
- **`package.json`** - Dependencias y scripts
- **`vite.config.js`** - Configuración de Vite con PWA
- **`jsconfig.json`** - Configuración de JavaScript y path mapping
- **`tailwind.config.js`** - Configuración de Tailwind CSS
- **`.eslintrc.js`** - Configuración de ESLint
- **`.prettierrc`** - Configuración de Prettier
- **`vitest.config.js`** - Configuración de testing
- **`index.html`** - HTML principal de la aplicación

**En `src/`:**
- **`main.jsx`** - Punto de entrada de React
- **`App.jsx`** - Componente principal con routing
- **`styles/globals.css`** - Estilos globales con Tailwind

### Variables de Entorno

Copia `env.example` a `.env` y configura las variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1

# Map Configuration
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
VITE_DEFAULT_LATITUDE=40.4168
VITE_DEFAULT_LONGITUDE=-3.7038
VITE_DEFAULT_ZOOM=13
```

## 🚀 Instalación y Configuración



### Pasos para Empezar

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Hackaton_grupo3_frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con hot reload
npm run build        # Build para producción
npm run preview      # Preview del build de producción

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Fix automático de problemas de linting

# Testing
npm run test         # Ejecutar tests
npm run test:ui      # Tests con interfaz gráfica
npm run test:coverage # Tests con reporte de cobertura
```

## 🎨 Sistema de Diseño

### Colores del Tema

- **Primary**: Naranja (#f27c0a) - Color principal del Ratoncito Pérez
- **Secondary**: Azul (#0ea5e9) - Color secundario
- **Accent**: Púrpura (#d946ef) - Color de acento

### Fuentes

- **Display**: Fredoka One (títulos y elementos destacados)
- **Body**: Inter (texto general)

### Componentes Predefinidos

- `.btn-primary` - Botón principal
- `.btn-secondary` - Botón secundario
- `.btn-outline` - Botón con borde
- `.card` - Tarjeta básica
- `.adventure-card` - Tarjeta de aventura
- `.story-card` - Tarjeta de historia
- `.reward-card` - Tarjeta de recompensa

## 🗺️ Funcionalidades por Implementar

### Páginas Principales
- [ ] **HomePage** - Página de bienvenida
- [ ] **MapPage** - Mapa interactivo de Madrid
- [ ] **AdventurePage** - Página de aventura individual
- [ ] **ProfilePage** - Perfil de usuario

### Features
- [ ] **Sistema de Aventuras** - Gestión de aventuras y retos
- [ ] **Mapa Interactivo** - Navegación y marcadores
- [ ] **Sistema de Historias** - Narrativa del Ratoncito Pérez
- [ ] **Sistema de Recompensas** - Monedas y logros
- [ ] **Geolocalización** - Detección de ubicación

### Componentes UI
- [ ] **Button** - Botones reutilizables
- [ ] **Card** - Tarjetas de contenido
- [ ] **Modal** - Ventanas modales
- [ ] **Map** - Componente de mapa
- [ ] **StoryCard** - Tarjeta de historia
- [ ] **AdventureCard** - Tarjeta de aventura
- [ ] **RewardCard** - Tarjeta de recompensa

## 🔗 Integración con Backend

El frontend está configurado para integrarse con el backend de Python/FastAPI:

- **API Base URL**: `http://localhost:8000`
- **Endpoints principales**:
  - `/api/v1/adventures` - Aventuras disponibles
  - `/api/v1/locations` - Ubicaciones de Madrid
  - `/api/v1/stories` - Historias del Ratoncito Pérez
  - `/api/v1/rewards` - Sistema de recompensas

## 📱 PWA (Progressive Web App)

La aplicación está configurada como PWA:

- **Manifest**: Configurado para instalación en móviles
- **Service Worker**: Cache automático de recursos
- **Offline Support**: Funcionalidad básica sin conexión
- **App Icons**: Iconos para diferentes tamaños de pantalla

## 🧪 Testing

- **Vitest** - Framework de testing
- **Testing Library** - Utilidades para testing de React
- **JSDOM** - Entorno de testing
- **Coverage** - Reporte de cobertura de código

## 📝 Convenciones de Código

### Estructura de Archivos
- **Componentes**: PascalCase (`Button.jsx`)
- **Hooks**: camelCase con prefijo `use` (`useAdventure.js`)
- **Utilidades**: camelCase (`formatDate.js`)
- **Constantes**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)

### Imports
```javascript
// Imports absolutos usando aliases
import Button from '@components/ui/Button/Button'
import { useAdventure } from '@hooks/useAdventure'
import { API_BASE_URL } from '@utils/constants'
```

### Estructura de Componentes
```javascript
// 1. Imports
import React from 'react'
import PropTypes from 'prop-types'

// 2. Componente
const ComponentName = ({ prop1, prop2 }) => {
  // 3. Hooks
  // 4. Estados
  // 5. Efectos
  // 6. Funciones
  // 7. Render
  return <div>Content</div>
}

// 8. PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
}

// 9. Export
export default ComponentName
```

## 🤝 Contribución

1. Crear una rama para tu feature: `git checkout -b feature/nombre-feature`
2. Hacer commit de tus cambios: `git commit -m 'Add: descripción del cambio'`
3. Push a la rama: `git push origin feature/nombre-feature`
4. Crear Pull Request

## 📞 Contacto

- **Equipo**: Hackaton Grupo 3
- **Proyecto**: Ratoncito Pérez Adventure
- **Tecnologías**: React + Vite + FastAPI + MongoDB + LangGraph