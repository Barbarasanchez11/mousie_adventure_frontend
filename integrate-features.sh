#!/bin/bash

# Script para integrar todas las features en development-v2
echo "🚀 Integrando todas las features en development-v2..."

# Función para copiar archivos de una rama
copy_from_branch() {
    local branch=$1
    local files=("$@")
    
    echo "📁 Copiando archivos de $branch..."
    
    # Cambiar a la rama
    git checkout $branch
    
    # Copiar cada archivo
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo "  ✅ Copiando $file"
            cp "$file" "../temp_$file"
        else
            echo "  ❌ No encontrado: $file"
        fi
    done
    
    # Volver a development-v2
    git checkout development-v2
    
    # Mover archivos copiados
    for file in "${files[@]}"; do
        if [ -f "../temp_$file" ]; then
            mkdir -p "$(dirname "$file")"
            mv "../temp_$file" "$file"
        fi
    done
}

# 1. GPS Location
echo "📍 Integrando GPS Location..."
copy_from_branch "feature/gps-location" \
    "src/hooks/location/useGeolocation.js" \
    "src/components/ui/LocationButton/LocationButton.jsx"

# 2. API Services
echo "🔌 Integrando API Services..."
copy_from_branch "feature/api-services" \
    "src/services/api/health.js" \
    "src/services/api/adventure.js" \
    "src/components/ui/HealthCheck/HealthCheck.jsx" \
    "src/components/ui/AdventureDisplay/AdventureDisplay.jsx" \
    "src/components/ui/AdventureTest/AdventureTest.jsx"

# 3. QA System
echo "💬 Integrando QA System..."
copy_from_branch "feature/qa-system" \
    "src/services/api/qa.js" \
    "src/components/ui/ChatInterface/ChatInterface.jsx" \
    "src/components/ui/MessageBubble/MessageBubble.jsx"

# 4. Gamification (ya está en development-v2)
echo "🏆 Gamification ya está integrado"

# Limpiar archivos temporales
rm -f ../temp_*

echo "✅ ¡Integración completada!"
echo "📁 Archivos integrados en development-v2"
