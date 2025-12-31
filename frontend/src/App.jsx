import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Songs from './pages/Songs'
import Artists from './pages/Artists'
import Albums from './pages/Albums'
import Playlists from './pages/Playlists'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/songs" element={<Songs />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/albums" element={<Albums />} />
                  <Route path="/playlists" element={<Playlists />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

