import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Lazy load pages for better performance
const HomePage = lazy(() => import('@pages/home/HomePage'))
const MapPage = lazy(() => import('@pages/map/MapPage'))
const AdventurePage = lazy(() => import('@pages/adventure/AdventurePage'))
const ProfilePage = lazy(() => import('@pages/profile/ProfilePage'))

// Components
import Loading from '@components/common/Loading/Loading'
import ErrorBoundary from '@components/common/Error/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/adventure" element={<AdventurePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
