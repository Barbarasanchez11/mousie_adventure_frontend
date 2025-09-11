import React, { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false) // Cerrar menú móvil después de hacer clic
  }

  return (
    <nav className="navbar bg-white shadow-lg border-b border-gray-200 sticky top-0 z-[9998]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl sm:text-3xl">🐭</span>
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-800">
                Ratoncito Pérez
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
              <button
                onClick={() => scrollToSection('rutas')}
                className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                🛤️ Rutas
              </button>
              <button
                onClick={() => scrollToSection('mapa')}
                className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                🗺️ Mapa
              </button>
              <button
                onClick={() => scrollToSection('gamificacion')}
                className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                🏆 Gamificación
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <button
            onClick={() => scrollToSection('rutas')}
            className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
          >
            🛤️ Rutas Temáticas
          </button>
          <button
            onClick={() => scrollToSection('mapa')}
            className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
          >
            🗺️ Mapa Interactivo
          </button>
          <button
            onClick={() => scrollToSection('gamificacion')}
            className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
          >
            🏆 Sistema de Gamificación
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
